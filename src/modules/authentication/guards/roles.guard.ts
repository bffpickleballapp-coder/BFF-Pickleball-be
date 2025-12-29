// roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClerkUserPayload } from '../interface'; // Import interface global của bạn

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // 👈 Quan trọng: Phải inject Reflector

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách roles được truyền vào từ decorator @Auth(['admin', ...])
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Nếu route không yêu cầu role cụ thể nào -> Cho qua (miễn là đã login)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. Lấy user từ request (User này đã được ClerkAuthGuard gắn vào ở bước trước)
    const request = context.switchToHttp().getRequest();
    const user = request.user as ClerkUserPayload;

    // 4. Logic kiểm tra quyền
    // Nếu không có user hoặc user chưa có role -> Chặn
    if (!user || !user.role) {
      throw new ForbiddenException('Access Denied: No role assigned');
    }

    // Kiểm tra xem role của user có nằm trong danh sách cho phép không
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access Denied: Required roles [${requiredRoles.join(', ')}] but you are [${user.role}]`,
      );
    }

    return true;
  }
}
