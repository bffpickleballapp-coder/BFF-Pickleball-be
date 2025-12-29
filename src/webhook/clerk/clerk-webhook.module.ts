import { Module } from '@nestjs/common';
import { ClerkWebhookController } from './clerk-webhook.controller';
import { ClerkWebhookService } from './clerk-webhook.service';
import { UsersService } from '@src/modules/User/user.service';

@Module({
  imports: [], // Cần ConfigModule để đọc biến môi trường
  controllers: [ClerkWebhookController],
  providers: [ClerkWebhookService, UsersService],
})
export class ClerkWebhookModule {}
