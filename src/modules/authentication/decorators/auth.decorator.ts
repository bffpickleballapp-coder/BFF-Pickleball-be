// auth.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

// Nhận vào danh sách roles (VD: ['admin', 'manager'])
export function Auth(roles: string[] = []) {
  // 1. Các decorator cơ bản luôn chạy
  const decorators = [
    ApiBearerAuth(),
    UseGuards(ClerkAuthGuard),
    ApiUnauthorizedResponse({
      description: 'Unauthorized: Missing or invalid token',
    }),
  ];

  // 2. Nếu có truyền roles, thì thêm logic check role
  if (roles.length > 0) {
    decorators.push(SetMetadata('roles', roles));
    decorators.push(UseGuards(RolesGuard));
    decorators.push(
      ApiForbiddenResponse({
        description: 'Forbidden: Insufficient permissions',
      }),
    );
  }

  return applyDecorators(...decorators);
}
