import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.service';
import { Auth } from '../authentication/decorators/auth.decorator';
import { RequestUser } from './decorators/RequestUser.decorator';
import type { ClerkUserPayload } from '../authentication/interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Auth()
  async getMyUserProfile(@RequestUser() user: ClerkUserPayload) {
    console.log(user);
    // user.clerkId lấy từ Token
    // Service sẽ dùng nó để trả về User Full (có ID, balance,...)
    return this.usersService.findOneUser(user.clerkId);
  }
}
