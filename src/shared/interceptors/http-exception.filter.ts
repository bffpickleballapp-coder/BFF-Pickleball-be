import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  createErrorLogDetails,
  sanitizeRequestBody,
} from '@src/shared/helpers/error-logging.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor() {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (request.url.includes('favicon.ico')) {
      return response.status(HttpStatus.NOT_FOUND).send();
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let messageKey = 'common.server_error';
    if (typeof errorResponse === 'object' && errorResponse !== null) {
      messageKey = errorResponse.message || messageKey;
    } else if (typeof errorResponse === 'string') {
      messageKey = errorResponse;
    }

    const logMessage = `[${request.method}] ${request.url} - Status: ${status} - ${exception instanceof Error ? exception.message : 'Unknown error'}`;
    if (status >= 500) {
      const errorDetails = createErrorLogDetails(
        request,
        status,
        exception,
        errorResponse,
      );
      errorDetails.body = sanitizeRequestBody(errorDetails.body);

      this.logger.error(logMessage, errorDetails);
    } else {
      this.logger.warn(logMessage);
    }

    response.status(status).json({
      success: false,
      code: status,
      message: messageKey,
      httpCode: status,
    });
  }
}
