import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {
  loggerMiddleware,
  requestIdempotencySetter,
  requestStoreMiddleware,
  responseTimeMiddleware,
} from '..';

export const applyMiddleware = (consumer: MiddlewareConsumer) => {
  consumer
    .apply(
      requestStoreMiddleware,
      requestIdempotencySetter,
      loggerMiddleware,
      responseTimeMiddleware,
    )
    .forRoutes({ path: '*', method: RequestMethod.ALL });
};
