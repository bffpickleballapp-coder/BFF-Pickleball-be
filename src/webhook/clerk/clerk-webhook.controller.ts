import {
  Controller,
  Post,
  Headers,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ClerkWebhookService } from './clerk-webhook.service';
import { UsersService } from '@src/modules/user/user.service';

@Controller('webhook')
export class ClerkWebhookController {
  constructor(
    private readonly authService: ClerkWebhookService,
    private userService: UsersService,
  ) {}

  @Post('clerk')
  async handleClerkWebhook(
    @Headers() headers: Record<string, string>,
    @Body() payload: any,
  ) {
    // 1. Xác minh chữ ký (Gọi Service)
    const evt: any = this.authService.verifyWebhook(headers, payload);

    // 2. Xử lý sự kiện (Switch Case)
    const eventType = evt.type;

    // evt.data chứa thông tin user (id, email,...)
    const { id } = evt.data;

    console.log(`Received event: ${eventType}`);

    //console.log(evt.data);
    if (eventType === 'user.created') {
      await this.userService.addUserClerk(evt.data);
    }
    if (eventType === 'organizationMembership.created') {
      await this.userService.addOrUpdateRoleClerk(evt.data);
    }
    if (eventType === 'user.deleted') {
      // TODO: Gọi User Service để xóa user
      console.log('User deleted:', id);
    }

    return { success: true };
  }
}
