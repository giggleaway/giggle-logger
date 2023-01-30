import { getMockReq, getMockRes } from '@jest-mock/express';
import { requestStore } from '../../requestStore';
import { responseTimeMiddleware } from '../responseTimeMiddleware';

jest.mock('../../requestStore', () => {
  return {
    requestStore: {
      set: jest.fn(),
    },
    Latency: 'latency',
  };
});

let mockSet: jest.Mock<any, any>;
const req = getMockReq();
const { res, next, mockClear: mockResClear } = getMockRes({ statusCode: 404 });

beforeEach(() => {
  mockSet = requestStore.set as jest.Mock<any, any>;
  mockSet.mockClear();
  mockResClear();
});

test('Calls logger.info with the correct properties', async () => {
  responseTimeMiddleware(req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(mockSet).toHaveBeenCalledTimes(1);
  expect(mockSet).toHaveBeenCalledWith(
    expect.stringContaining('latency'),
    expect.stringMatching(/^\d\.\d.*ms$/),
  );
});

test('When an error is raised, still calls logger.info with the correct properties', async () => {
  const nextFn = jest.fn().mockReturnValueOnce(new Error('Test'));
  responseTimeMiddleware(req, res, nextFn);
  expect(nextFn).toHaveBeenCalledTimes(1);
  expect(mockSet).toHaveBeenCalledTimes(1);
  expect(mockSet).toHaveBeenCalledWith(
    expect.stringContaining('latency'),
    expect.stringMatching(/^\d\.\d.*ms$/),
  );
});
