import { Request } from 'express';

export interface ErrorLogDetails {
  path: string;
  method: string;
  statusCode: number;
  timestamp: string;
  userAgent?: string;
  ip?: string;
  body?: any;
  query?: any;
  params?: any;
  headers: {
    'content-type'?: string;
    authorization?: string;
    'x-lang'?: string;
    'accept-language'?: string;
  };
  errorResponse?: any;
  stack?: string;
  message: string;
  responseData?: any;
}

/**
 * Create standardized error log details from request and error information
 */
export function createErrorLogDetails(
  req: Request,
  statusCode: number,
  exception?: unknown,
  errorResponse?: any,
  responseData?: any,
): ErrorLogDetails {
  return {
    path: req.url,
    method: req.method,
    statusCode,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    ip:
      (req.headers['x-forwarded-for'] as string) ||
      req.ip ||
      req.connection?.remoteAddress,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: {
      'content-type': req.headers['content-type'],
      authorization: req.headers.authorization ? '[REDACTED]' : undefined,
      'x-lang': Array.isArray(req.headers['x-lang'])
        ? req.headers['x-lang'][0]
        : req.headers['x-lang'],
      'accept-language': req.headers['accept-language'],
    },
    errorResponse,
    stack: exception instanceof Error ? exception.stack : undefined,
    message:
      exception instanceof Error
        ? exception.message
        : String(exception || 'Unknown error'),
    responseData,
  };
}

/**
 * Sanitize sensitive data from request body for logging
 */
export function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'credential',
  ];
  const sanitized = { ...body };

  Object.keys(sanitized).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (sensitiveFields.some((field) => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    }
  });

  return sanitized;
}
