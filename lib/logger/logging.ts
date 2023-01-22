import pino from 'pino';

import { Id, requestStore } from '../requestStore';
import { LogLevel } from '../types';
import { levelFormatter } from './util/levelFormatter';

export class GiggleLogger {
  private static logger: pino.Logger | null = null;

  public static getLogger(): pino.Logger {
    if (GiggleLogger.logger == null) {
      throw new Error(`GiggleLogger must be initialized before use`);
    }

    return GiggleLogger.logger;
  }

  public static initialize(logLevel: LogLevel): void {
    GiggleLogger.logger = pino({
      formatters: {
        level: levelFormatter,
      },
      level: logLevel,
      mixin: () => ({ requestId: requestStore.get(Id) }),
    });
  }
}
