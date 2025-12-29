import { Module, Global } from '@nestjs/common';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [ConfigModule], // Import để dùng biến môi trường (nếu cần mở rộng sau này)
  providers: [ClerkAuthGuard], // Khởi tạo Guard
  exports: [ClerkAuthGuard],   // EXPORT ĐỂ CÁC MODULE KHÁC (USER, BOOKING) DÙNG ĐƯỢC
})
export class AuthenticationModule {}