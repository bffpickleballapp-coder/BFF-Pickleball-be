import { Injectable, BadRequestException } from '@nestjs/common';
import { Webhook } from 'svix';

@Injectable()
export class ClerkWebhookService {
    private webhookSecret: string;

    constructor() {
        // SỬA Ở ĐÂY: Gán vào biến tạm để kiểm tra trước
        const secret = process.env.CLERK_WEBHOOK_SECRET;

        // Nếu không có secret -> Báo lỗi ngay lập tức để app crash (Fail fast)
        if (!secret) {
            throw new Error('CLERK_WEBHOOK_SECRET is not defined in .env');
        }

        // Lúc này TypeScript đã hiểu 'secret' chắc chắn là string
        this.webhookSecret = secret;
    }

    public verifyWebhook(headers: any, payload: any) {
        const wh = new Webhook(this.webhookSecret);

        const svix_id = headers['svix-id'];
        const svix_timestamp = headers['svix-timestamp'];
        const svix_signature = headers['svix-signature'];

        if (!svix_id || !svix_timestamp || !svix_signature) {
            throw new BadRequestException('Missing svix headers');
        }

        try {
            // payload cần là string raw để verify
            const evt = wh.verify(JSON.stringify(payload), {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            }) as any; // Cast về any hoặc type của Clerk Event nếu có

            return evt;
        } catch (err) {
            console.error('Webhook verification failed:', err);
            throw new BadRequestException('Webhook verification failed');
        }
    }
}