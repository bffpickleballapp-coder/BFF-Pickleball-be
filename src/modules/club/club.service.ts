import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MODEL_NAME } from '@src/shared/constants/model.name.enum';
import { BaseCRUDService } from '@src/shared/services/base-crud.service';
import { ClubMemberStatusDto, CreateClubDto, UpdateClubDto } from './club.dto';
import { HttpResponse, PaginationResult } from '@src/shared/interfaces';
import { validateRegion } from '@src/shared/util/validate.region';
import { uploadImgService } from '@src/shared/util/upload-img';
import { PaginatedDynamicQueryDto } from '@src/shared/dtos/pagination.dto';
import { STATUS_USER_CLUB } from '@src/shared/constants/bases.enum';
import { Clubs } from '@src/generated/prisma/client';
import { CLUB_LIST_SELECT, CLUB_SELECT, MEMBERS } from './club.selection';
import { MY_CLUB_TYPE } from './club.constant';
import { UsersService } from '../User/user.service';
import { ClerkUserPayload } from '../authentication/interface';

@Injectable()
export class ClubService extends BaseCRUDService {
  constructor(
    private imgService: uploadImgService,
    private userService: UsersService,
  ) {
    super({ model: MODEL_NAME.CLUBS });
  }

  async createClub(
    dto: CreateClubDto,
    user: ClerkUserPayload,
    file?: Express.Multer.File,
  ): Promise<HttpResponse> {
    if (
      !(await validateRegion({
        provinceCode: dto.provinceCode,
        wardCode: dto.wardCode,
      }))
    )
      throw new NotFoundException('Ward or province not found');

    const exitUser = await this.userService.findOneUser(user.clerkId);
    if (!exitUser) throw new NotFoundException('User not found');

    let imageUrl: string | null = null;
    if (file) {
      const uploadResult = await this.imgService.uploadImage(file, 'club');
      imageUrl = uploadResult.url ?? null;
    }

    const { imageUrl: _ignore, ...clubData } = dto;

    const createdClub = await this.create(
      {
        ...clubData,
        imageUrl: imageUrl,
        owner: {
          connect: { id: exitUser.id },
        },
        members: {
          create: {
            userId: exitUser.id,
            status: STATUS_USER_CLUB.OWNER,
            joinedAt: new Date(),
          },
        },
      },
      { select: CLUB_SELECT },
    );

    return {
      httpCode: 200,
      data: createdClub,
      message: 'Club created successfully',
      success: true,
    };
  }

  async updateClub(
    id: number,
    dto: UpdateClubDto,
    user: ClerkUserPayload,
  ): Promise<HttpResponse> {
    if (
      !(await validateRegion({
        provinceCode: dto.provinceCode,
        wardCode: dto.wardCode,
      }))
    )
      throw new NotFoundException('Ward or province not found');
    const club = await this.findById(id);
    if (!club) throw new NotFoundException('Club not found');

    const exitUser = await this.userService.findOneUser(user.clerkId);
    if (!exitUser) throw new NotFoundException('User not found');

    if (club.ownerId !== exitUser.id) {
      throw new ForbiddenException('You are not the owner of this club');
    }

    const updatedClub = await this.updateById(id, dto, { select: CLUB_SELECT });

    return {
      httpCode: 200,
      data: updatedClub,
      message: 'Club updated successfully',
      success: true,
    };
  }

  async deleteClub(id: number, user: ClerkUserPayload): Promise<HttpResponse> {
    const club = await this.findById(id);
    if (!club) throw new NotFoundException('Club not found');

    const exitUser = await this.userService.findOneUser(user.clerkId);
    if (!exitUser) throw new NotFoundException('User not found');

    if (club.ownerId !== exitUser.id) {
      throw new ForbiddenException('You are not the owner of this club');
    }

    await this.deleteById(id);

    return {
      httpCode: 200,
      data: true,
      message: 'Club deleted successfully',
      success: true,
    };
  }

  async getClubList(dto: PaginatedDynamicQueryDto): Promise<HttpResponse> {
    const result = await this.paginated(dto, dto.search, dto.q, {
      searchFields: ['name', 'description'],
      select: CLUB_SELECT,
    });

    return {
      httpCode: 200,
      data: result,
      success: true,
    };
  }

  async getMyClubList(
    dto: PaginatedDynamicQueryDto,
    user: ClerkUserPayload,
    type: MY_CLUB_TYPE,
  ): Promise<HttpResponse> {
    const exitUser = await this.userService.findOneUser(user.clerkId);
    if (!exitUser) throw new NotFoundException('User not found');
    let result: PaginationResult<any>;
    if (type === MY_CLUB_TYPE.OWNER) {
      result = await this.paginated(
        dto,
        dto.search,
        {
          ...dto.q,
          ownerId: exitUser.id,
        },
        {
          searchFields: ['name', 'description'],
          select: CLUB_LIST_SELECT,
        },
      );
    } else {
      result = await this.paginated(
        dto,
        dto.search,
        {
          ...dto.q,
          members: {
            some: {
              userId: exitUser.id,
            },
          },
          ownerId: {
            not: exitUser.id,
          },
        },
        {
          searchFields: ['name', 'description'],
          select: {
            ...CLUB_LIST_SELECT,
            members: {
              where: {
                userId: exitUser.id,
              },
              select: MEMBERS,
              take: 1,
            },
          },
        },
      );
    }

    return {
      httpCode: 200,
      data: result,
      success: true,
    };
  }

  async getClubDetail(id: number): Promise<HttpResponse> {
    const club = await this.findById(id, { select: CLUB_SELECT });
    if (!club) throw new NotFoundException('Club not found');

    return {
      httpCode: 200,
      data: club,
      message: 'Club detail',
      success: true,
    };
  }

  async addMember(
    id: number,
    userIdToAdd: string,
    user: ClerkUserPayload,
  ): Promise<HttpResponse> {
    const club = await this.findById(id);
    if (!club) throw new NotFoundException('Club not found');

    const exitUser = await this.userService.findOneUser(user.clerkId);
    if (!exitUser || club.ownerId !== exitUser.id) {
      throw new ForbiddenException('You are not the owner of this club');
    }

    // Check if user to add exists
    const userToAdd = await this.userService.findOneUser(userIdToAdd);
    if (!userToAdd) throw new NotFoundException('User to add not found');

    // Check if already a member
    const existingMember = await this.prisma.clubMembers.findUnique({
      where: {
        clubId_userId: {
          clubId: id,
          userId: userIdToAdd,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member');
    }

    await this.prisma.clubMembers.create({
      data: {
        clubId: id,
        userId: userIdToAdd,
        status: STATUS_USER_CLUB.ACTIVE,
        joinedAt: new Date(),
      },
    });

    return {
      httpCode: 200,
      data: true,
      message: 'User added to club successfully',
      success: true,
    };
  }

  async changeMemberStatus(
    id: number,
    userIdToChange: string,
    dto: ClubMemberStatusDto,
    user: ClerkUserPayload,
  ): Promise<HttpResponse> {
    const club = await this.findById(id);
    if (!club) throw new NotFoundException('Club not found');

    const exitUser = await this.userService.findOneUser(user.clerkId);
    if (!exitUser || club.ownerId !== exitUser.id) {
      throw new ForbiddenException('You are not the owner of this club');
    }

    const member = await this.prisma.clubMembers.findUnique({
      where: {
        clubId_userId: {
          clubId: id,
          userId: userIdToChange,
        },
      },
    });

    if (!member) throw new NotFoundException('Member not found');

    if (dto.status === 'kick') {
      await this.prisma.clubMembers.delete({
        where: {
          clubId_userId: {
            clubId: id,
            userId: userIdToChange,
          },
        },
      });
      return {
        httpCode: 200,
        data: 'Kicked successfully',
      };
    } else if (dto.status === 'block') {
      // Assuming 'BLOCKED' or 'block' is the value. Schema has varchar(50).
      await this.prisma.clubMembers.update({
        where: {
          clubId_userId: {
            clubId: id,
            userId: userIdToChange,
          },
        },
        data: {
          status: STATUS_USER_CLUB.BANNED,
        },
      });
      return {
        httpCode: 200,
        data: 'Blocked successfully',
      };
    }

    return {
      httpCode: 400,
      data: 'Invalid status',
    };
  }

  async joinClub(id: number, user: ClerkUserPayload): Promise<HttpResponse> {
    const club: Clubs = await this.findById(id);
    if (!club) throw new NotFoundException('Club not found');

    const exitUser = await this.userService.findOneUser(user.clerkId);
    if (!exitUser) throw new NotFoundException('User not found');

    const existingMember = await this.prisma.clubMembers.findUnique({
      where: {
        clubId_userId: {
          clubId: id,
          userId: exitUser.id,
        },
      },
    });

    if (existingMember) {
      return {
        httpCode: 200,
        data: existingMember,
      };
    }

    const data = {
      clubId: id,
      userId: exitUser.id,
      status: STATUS_USER_CLUB.ACTIVE,
      joinedAt: new Date(),
    };
    if (!club.isPublic) {
      data.status = STATUS_USER_CLUB.PENDING;
    }
    const newMember = await this.prisma.clubMembers.create({
      data: data,
    });

    return {
      httpCode: 200,
      data: {
        ...newMember,
        joinAt: newMember.joinedAt,
      },
    };
  }

  async leaveClub(id: number, user: ClerkUserPayload): Promise<HttpResponse> {
    const club = await this.findById(id);
    if (!club) throw new NotFoundException('Club not found');

    const exitUser = await this.userService.findOneUser(user.clerkId);
    if (!exitUser) throw new NotFoundException('User not found');

    const member = await this.prisma.clubMembers.findUnique({
      where: {
        clubId_userId: {
          clubId: id,
          userId: exitUser.id,
        },
      },
    });

    if (!member)
      throw new NotFoundException('You are not a member of this club');

    await this.prisma.clubMembers.delete({
      where: {
        clubId_userId: {
          clubId: id,
          userId: exitUser.id,
        },
      },
    });

    return {
      httpCode: 200,
      data: {
        ...member,
        joinAt: member.joinedAt,
      },
    };
  }
}
