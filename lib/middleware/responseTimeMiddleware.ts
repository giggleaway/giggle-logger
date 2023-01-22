import { NextFunction, Request, Response } from 'express';

import { Latency, requestStore } from '../requestStore';

export function responseTimeMiddleware(
  _request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const start = process.hrtime();
  try {
    next();
  } finally {
    const hrTime = process.hrtime(start);
    const delta = hrTime[0] * 1000 + hrTime[1] / 1000000;

    requestStore.set(Latency, `${delta}ms`);
  }
}
