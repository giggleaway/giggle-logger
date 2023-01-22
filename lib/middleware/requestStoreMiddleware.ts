import { NextFunction, Request, Response } from 'express';

import { requestStore } from '../requestStore';

export function requestStoreMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const store = requestStore.getStore();

  store.bindEmitter(request);
  store.bindEmitter(response);

  (async () => await store.runPromise(async () => next()))();
}
