import { getMockReq, getMockRes } from '@jest-mock/express';
import { loggerMiddleware } from '../loggerMiddleware';

const mockInfo = jest.fn();

jest.mock('../../logger/logging', () => {
  return {
    GiggleLogger: {
      getLogger: () => ({
        info: mockInfo,
      }),
    },
  };
});

jest.mock('../../requestStore', () => {
  return {
    requestStore: {
      get: () => '100ms',
    },
    Latency: 'latency',
  };
});

const req = getMockReq();
const { res, next, mockClear } = getMockRes({ statusCode: 404 });

beforeEach(() => {
  mockInfo.mockClear();
  mockClear();
});

test('Calls logger.info with the correct properties', async () => {
  loggerMiddleware(req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(mockInfo).toHaveBeenCalledTimes(2);
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({ status: 404, latency: '100ms' }),
    expect.stringContaining('Response sent'),
  );
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({ req: { method: req.method, url: req.url } }),
    expect.stringContaining('Request received'),
  );
});

test('Still calls the logger.info even if an error is thrown during next', async () => {
  const nextFn = jest.fn().mockReturnValueOnce(new Error('Test'));

  loggerMiddleware(req, res, nextFn);

  expect(nextFn).toHaveBeenCalledTimes(1);
  expect(mockInfo).toHaveBeenCalledTimes(2);
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({ status: 404, latency: '100ms' }),
    expect.stringContaining('Response sent'),
  );
});
