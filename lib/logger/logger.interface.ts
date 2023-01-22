import { LogFn } from 'pino';

export interface PinoBaseLogger {
  debug: LogFn;
  trace: LogFn;
  info: LogFn;
  warn: LogFn;
  fatal: LogFn;
  error: LogFn;
}
