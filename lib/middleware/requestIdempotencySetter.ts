import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Id, requestStore } from '../requestStore';

export const REQUEST_ID_HEADER_NAME = 'x-request-id';

export function requestIdempotencySetter(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  let id = request.headers[REQUEST_ID_HEADER_NAME] as string;
  if (!id) {
    id = uuidv4();
    request.headers[REQUEST_ID_HEADER_NAME] = id;
  }
  requestStore.set<string>(Id, id);
  next();
}
