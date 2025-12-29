import { Body, Controller, Post, Headers } from '@nestjs/common';
import { PaymentWebhookService } from './payment-webhook.service';

@Controller({ path: 'webhook' })
export class PaymentWebhookController {
  constructor(private readonly paymentWebhookService: PaymentWebhookService) {}
  @Post('bank')
  public webHookBank(
    @Body() body: any,
    @Headers() headers?: any,
  ): Promise<any> {
    return this.paymentWebhookService.handleWebhook(body, headers);
  }
}
