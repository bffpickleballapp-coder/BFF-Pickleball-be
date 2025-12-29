import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { sanitizeRequestBody } from '@src/shared/helpers/error-logging.helper';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, url, headers, body, query, params } = req;

    // Only log incoming request when explicitly enabled for debugging
    if (process.env.ENABLE_REQUEST_LOGGING === 'true') {
      this.logger.log(`Incoming Request: ${method} ${url}`, {
        method,
        url,
        userAgent: headers['user-agent'],
        ip: req.ip || req.connection?.remoteAddress,
        body: sanitizeRequestBody(body),
        query,
        params,
        timestamp: new Date().toISOString(),
      });
    }

    // Override res.end to log response
    const originalEnd = res.end.bind(res);
    const logger = this.logger;

    res.end = function (chunk?: any, encoding?: any, cb?: any) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Only log errors and warnings, not successful responses
      if (statusCode >= 400) {
        const logLevel = statusCode >= 500 ? 'error' : 'warn';

        (logger as any)[logLevel](
          `Response: ${method} ${url} - ${statusCode}`,
          {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          },
        );
      }

      return originalEnd(chunk, encoding, cb);
    };

    next();
  }
}
