import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { verifyToken } from '@clerk/clerk-sdk-node';
import { ClerkUserPayload } from '../interface';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Missing Token');

    try {
      // 1. Verify Token với Clerk
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        issuer: null,
      });
      console.log('payload', payload);
      console.log('role', payload.o);
      // 2. Chỉ lấy thông tin cơ bản từ Token
      const userPayload: ClerkUserPayload = {
        clerkId: payload.sub, // Cái này quan trọng nhất
        role: payload['o']?.['rol'],
      };
      // 3. Gắn vào request để thằng sau dùng
      request['user'] = userPayload;
      console.log('test', userPayload);
      return true; // ✅ Cho qua!
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException('Invalid Token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}