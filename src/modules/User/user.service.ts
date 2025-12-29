import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseCRUDService } from '@src/shared/services/base-crud.service';
import { MODEL_NAME } from '@src/shared/constants/model.name.enum';
import { Users } from '@src/generated/prisma/client';
import { HttpResponse } from '@src/shared/interfaces';
import { CreateUserFromClerkDto, RoleClerkDto } from './user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService extends BaseCRUDService {
  constructor() {
    super({ model: MODEL_NAME.USERS });
  }

  public async findOneUser(id: string): Promise<Users | null> {
    const user = await this.findFirst({
      OR: [{ id: id }, { clerkId: id }],
    });

    if (!user) {
      // throw new NotFoundException('User not found');
      return null;
    }

    return user;
  }

  public async addUserClerk(
    dto: CreateUserFromClerkDto,
  ): Promise<HttpResponse> {
    try {
      const userDto = plainToInstance(CreateUserFromClerkDto, dto, {
        excludeExtraneousValues: true,
      });

      const user = await this.create(userDto);
      return {
        httpCode: 200,
        data: user,
        message: 'User added successfully',
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        httpCode: 500,
        data: null,
        message: 'Failed to add user',
        success: false,
      };
    }
  }

  public async addOrUpdateRoleClerk(dto: RoleClerkDto): Promise<HttpResponse> {
    const roleDto = plainToInstance(RoleClerkDto, dto, {
      excludeExtraneousValues: true,
    });
    const user = await this.findOneUser(roleDto.clerkId);
    if (!user) throw new NotFoundException('User not found');
    user.role = roleDto.role;
    await this.updateById(user.id, { role: roleDto.role });
    return {
      httpCode: 200,
      data: user,
      message: 'User role updated successfully',
      success: true,
    };
  }
}
