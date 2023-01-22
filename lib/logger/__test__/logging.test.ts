import { LogLevel, Severities } from '../../types';
import { GiggleLogger } from '..';
import * as utils from '../util/levelFormatter';
import { PinoBaseLogger } from '../logger.interface';

const info: LogLevel = 'info';
const trace: LogLevel = 'trace';
const debug: LogLevel = 'debug';

test('Calling logger without initializing throws error', () => {
  expect(() => GiggleLogger.getLogger()).toThrow('GiggleLogger must be initialized before use');
});

test('Calling logger with info initializing returns pino object that is set to info', () => {
  GiggleLogger.initialize(info);
  const logger = GiggleLogger.getLogger();
  logger.isLevelEnabled(info);
  logger.info('log info');
  expect(logger.isLevelEnabled(info)).toBeTruthy();
  expect(logger.isLevelEnabled(debug)).toBeFalsy();
});

test('Calling logger with debug initializing returns pino object that is set to debug', () => {
  GiggleLogger.initialize(debug);
  const logger = GiggleLogger.getLogger();
  logger.isLevelEnabled(debug);
  logger.info('log debug');
  expect(logger.isLevelEnabled(info)).toBeTruthy();
  expect(logger.isLevelEnabled(debug)).toBeTruthy();
});

test.each([
  { label: 'trace', expectedSeverity: Severities.DEBUG, expectedLevel: 10 },
  { label: 'debug', expectedSeverity: Severities.DEBUG, expectedLevel: 20 },
  { label: 'info', expectedSeverity: Severities.INFO, expectedLevel: 30 },
  { label: 'warn', expectedSeverity: Severities.WARNING, expectedLevel: 40 },
  { label: 'error', expectedSeverity: Severities.ERROR, expectedLevel: 50 },
  { label: 'fatal', expectedSeverity: Severities.CRITICAL, expectedLevel: 60 },
])(
  'Calls the level formatter with the appropriate severity: %label',
  ({ label, expectedSeverity, expectedLevel }) => {
    const severitySpy = jest.spyOn(utils, 'levelFormatter');
    GiggleLogger.initialize(trace);
    const logger = GiggleLogger.getLogger();
    logger[label as keyof PinoBaseLogger]('log');
    expect(severitySpy).toHaveReturnedWith({
      level: expectedLevel,
      severity: expectedSeverity,
    });
  },
);
