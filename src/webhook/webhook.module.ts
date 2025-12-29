import { Module } from '@nestjs/common';
import { PaymentWebhookModule } from './payment/payment-webhook.module';
import { ClerkWebhookModule } from './clerk/clerk-webhook.module';

@Module({
  imports: [PaymentWebhookModule, ClerkWebhookModule],
})
export class WebhookModule {}
