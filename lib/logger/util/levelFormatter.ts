import { LogLevel, Severities } from '../../types';

const PinoLevelToSeverityLookup = {
  trace: Severities.DEBUG,
  debug: Severities.DEBUG,
  info: Severities.INFO,
  warn: Severities.WARNING,
  error: Severities.ERROR,
  fatal: Severities.CRITICAL,
};

export const levelFormatter = (label: string, number: number) => {
  return {
    severity: PinoLevelToSeverityLookup[label as LogLevel] || PinoLevelToSeverityLookup.info,
    level: number,
  };
};
