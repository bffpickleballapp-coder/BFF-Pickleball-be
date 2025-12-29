import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { AuthenticationModule } from '../authentication/authentication.module'; // Import để dùng @Auth

@Module({
  imports: [
    AuthenticationModule 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export Service nếu module khác cần dùng
})
export class UsersModule {}