import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { HttpResponse } from '@src/shared/interfaces';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const res: Response = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map((response: HttpResponse) => {
        if (response?.httpCode) {
          res.status(response.httpCode);
          return response;
        }

        if (response?.success === false) {
          res.status(response?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR);
          return {
            success: false,
            code: response?.code,
            httpCode: response?.httpCode || HttpStatus.INTERNAL_SERVER_ERROR,
            message: response?.message,
          };
        }

        const payload = response?.data ?? response ?? null;

        res.status(HttpStatus.OK);
        return {
          success: true,
          data: payload,
          message: response?.message || 'Success',
          code: response?.code,
        };
      }),
    );
  }
}
