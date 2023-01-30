import { getMockReq, getMockRes } from '@jest-mock/express';
import { requestStoreMiddleware } from '..';

const mockBindEmitter = jest.fn();
const mockRunPromise = jest.fn();
jest.mock('../../requestStore', () => {
  return {
    requestStore: {
      getStore: () => {
        return {
          bindEmitter: mockBindEmitter,
          runPromise: mockRunPromise.mockImplementation((fn) => {
            fn();
          }),
        };
      },
    },
  };
});

const req = getMockReq();
const { res, next, mockClear: mockResClear } = getMockRes({ statusCode: 404 });

beforeEach(() => {
  mockResClear();
});

test('When the header is blank should set the request id to a new uuid', async () => {
  requestStoreMiddleware(req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(mockBindEmitter).toHaveBeenCalledTimes(2);
  expect(mockRunPromise).toHaveBeenCalledTimes(1);
});
