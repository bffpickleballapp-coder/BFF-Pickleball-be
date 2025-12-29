import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ClerkUserPayload } from '../../authentication/interface';

export const RequestUser = createParamDecorator(
  async (isOptional: string, ctx: ExecutionContext) => {
    const isRequired = !isOptional;
    const user: ClerkUserPayload = ctx.switchToHttp().getRequest().user;

    if (isRequired && (!user || user.deletedAt))
      throw new Error('Invalid user');
    return user;
  },
);
