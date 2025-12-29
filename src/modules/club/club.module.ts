import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { uploadImgService } from '../../shared/util/upload-img';
import { UsersService } from '../user/user.service';
@Module({
  imports: [],
  providers: [ClubService, uploadImgService, UsersService],
  controllers: [ClubController],
})
export class ClubModule {}
