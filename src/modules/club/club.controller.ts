import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClubService } from './club.service';
import {
  ClubMemberStatusDto,
  CreateClubDto,
  queryMyClubDto,
  UpdateClubDto,
} from './club.dto';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginatedDynamicQueryDto } from '@src/shared/dtos/pagination.dto';
import { ClubPaginationResponse, ClubResponse } from './club.response';
import { Auth } from '../authentication/decorators/auth.decorator';

@Controller({ path: 'club', version: '1' })
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 200,
    type: ClubResponse,
    description: 'Create a new club',
  })
  async createClub(
    @Body() dto: CreateClubDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return await this.clubService.createClub(dto, req.user, file);
  }

  @Put(':id')
  @Auth()
  @ApiResponse({
    status: 200,
    type: ClubResponse,
    description: 'Update club details',
  })
  async updateClub(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClubDto,
    @Req() req: any,
  ) {
    return await this.clubService.updateClub(id, dto, req.user);
  }

  @Delete(':id')
  //@UseGuards(ClerkAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Delete club',
  })
  async deleteClub(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return await this.clubService.deleteClub(id, req.user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: ClubResponse, // Note: Pagination result wrapper might be missing in type def, but usually acceptable to point to item type or paginated generic
    isArray: true, // Indicating a list (wrapped in pagination usually)
    description: 'Get club list',
  })
  async getClubList(@Query() query: PaginatedDynamicQueryDto) {
    return await this.clubService.getClubList(query);
  }

  @Get('my-clubs')
  @Auth()
  @ApiResponse({
    status: 200,
    type: ClubPaginationResponse,
    description: 'Get my club list',
  })
  async getMyClubList(@Query() query: queryMyClubDto, @Req() req: any) {
    return await this.clubService.getMyClubList(query, req.user, query.type);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ClubResponse,
    description: 'Get club detail',
  })
  async getClubDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.clubService.getClubDetail(id);
  }

  @Post(':id/add-member/:userId')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Add member to club',
  })
  async addMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
    @Req() req: any,
  ) {
    return await this.clubService.addMember(id, userId, req.user);
  }

  @Post(':id/status/:userId')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Change member status',
  })
  async changeMemberStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
    @Body() dto: ClubMemberStatusDto,
    @Req() req: any,
  ) {
    return await this.clubService.changeMemberStatus(id, userId, dto, req.user);
  }

  @Post(':id/join')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Join club',
  })
  async joinClub(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return await this.clubService.joinClub(id, req.user);
  }

  @Post(':id/leave')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Leave club',
  })
  async leaveClub(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return await this.clubService.leaveClub(id, req.user);
  }
}
