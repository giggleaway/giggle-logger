import { requestStore } from '../../requestStore';
import { requestIdempotencySetter, REQUEST_ID_HEADER_NAME } from '..';
import { getMockReq, getMockRes } from '@jest-mock/express';

jest.mock('uuid', () => {
  return {
    v4: () => '1',
  };
});

jest.mock('../../requestStore', () => {
  return {
    requestStore: {
      set: jest.fn(),
    },
    Id: 'id',
  };
});

let mockSet: jest.Mock<any, any>;
const req = getMockReq({
  headers: {
    'x-request-id': '1',
  },
});
const { res, next, mockClear: mockResClear } = getMockRes({ statusCode: 404 });

beforeEach(() => {
  mockSet = requestStore.set as jest.Mock<any, any>;
  mockSet.mockClear();
  mockResClear();
});

describe('no incoming headers', () => {
  test('should set the request id to a new uuid', async () => {
    requestIdempotencySetter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith(
      expect.stringContaining('id'),
      expect.stringContaining('1'),
    );
  });

  test('a header will be set to the generated uuid', async () => {
    requestIdempotencySetter(req, res, next);
    expect(req.headers[REQUEST_ID_HEADER_NAME]).toBe('1');
  });
});

test('When the header is filled should set the request id to the header', async () => {
  requestIdempotencySetter(req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(mockSet).toHaveBeenCalledTimes(1);
  expect(mockSet).toHaveBeenCalledWith(expect.stringContaining('id'), expect.stringContaining('1'));
});
