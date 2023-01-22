import { NextFunction, Request, Response } from 'express';

import { GiggleLogger } from '../logger';
import { Latency, requestStore } from '../requestStore';

export function loggerMiddleware(request: Request, response: Response, next: NextFunction): void {
  const { method, url } = request;
  GiggleLogger.getLogger().info({ req: { method, url } }, 'Request received');
  try {
    next();
  } finally {
    const { statusCode } = response;
    GiggleLogger.getLogger().info(
      { status: statusCode, latency: requestStore.get(Latency) },
      'Response sent',
    );
  }
}
