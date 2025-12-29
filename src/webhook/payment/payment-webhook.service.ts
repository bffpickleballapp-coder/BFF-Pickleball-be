import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentWebhookService {
  async handleWebhook(body: any, headers: any): Promise<any> {
    console.log(body);
    console.log('--------------');
    console.log(headers);

    return null;
  }
}
