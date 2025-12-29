import { Module } from '@nestjs/common';
import { PaymentWebhookService } from './payment-webhook.service';
import { PaymentWebhookController } from './payment-webhook.controller';

@Module({
  imports: [],
  providers: [PaymentWebhookService],
  controllers: [PaymentWebhookController],
})
export class PaymentWebhookModule {}
