import {
  BadRequestException,
  INestApplication,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import MockModule from './mocks/mockModule';

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

let app: INestApplication;

beforeEach(() => {
  mockInfo.mockReset();
});

afterEach(async () => {
  await app.close();
});

async function getTestApplication(
  route: string,
  method: 'GET' | 'POST',
  fn: (req: Request, res: Response, next: NextFunction) => void,
) {
  const moduleRef = await Test.createTestingModule({
    imports: [MockModule],
  }).compile();
  app = moduleRef.createNestApplication();
  app.use(fn);
  await app.init();
  if (method === 'GET') {
    return await request(app.getHttpServer()).get(route);
  }
  if (method === 'POST') {
    return await request(app.getHttpServer()).post(route);
  }
  throw new Error('Method not supported');
}

test('When middleware is connected with applyMiddleware requests hit logger with correct log', async () => {
  const response = await getTestApplication(
    '/',
    'GET',
    (_req: Request, _res: Response, next: NextFunction) => {
      next();
    },
  );
  expect(response.statusCode).toBe(200);
  expect(mockInfo).toHaveBeenCalledTimes(2);
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({
      status: 200,
      latency: expect.stringMatching(/\d\.\d.*ms/),
    }),
    expect.stringContaining('Response sent'),
  );
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({ req: { method: 'GET', url: '/' } }),
    expect.stringContaining('Request received'),
  );
});

test('When middleware is connected with applyMiddleware requests different url logs correctly', async () => {
  const response = await getTestApplication(
    '/hello',
    'GET',
    (_req: Request, _res: Response, next: NextFunction) => {
      next();
    },
  );
  expect(response.statusCode).toBe(200);
  expect(mockInfo).toHaveBeenCalledTimes(2);
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({
      status: 200,
      latency: expect.stringMatching(/\d\.\d.*ms/),
    }),
    expect.stringContaining('Response sent'),
  );
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({ req: { method: 'GET', url: '/hello' } }),
    expect.stringContaining('Request received'),
  );
});

test('When middleware is connected with applyMiddleware returns different status logs correctly', async () => {
  const response = await getTestApplication(
    '/',
    'GET',
    (_req: Request, res: Response, next: NextFunction) => {
      next();
      throw new BadRequestException();
    },
  );
  expect(response.statusCode).toBe(400);
  expect(mockInfo).toHaveBeenCalledTimes(2);
  // expect(mockInfo).toHaveBeenCalledWith(
  //   expect.objectContaining({
  //     status: 400,
  //     latency: expect.stringMatching(/\d\.\d.*ms/),
  //   }),
  //   expect.stringContaining('Response sent'),
  // );
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({ req: { method: 'GET', url: '/' } }),
    expect.stringContaining('Request received'),
  );
});

test('When middleware is connected with applyMiddleware returns different method logs correctly', async () => {
  const response = await getTestApplication(
    '/hello',
    'POST',
    (_req: Request, _res: Response, next: NextFunction) => {
      next();
    },
  );
  expect(response.statusCode).toBe(201);
  expect(mockInfo).toHaveBeenCalledTimes(2);
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({
      status: 201,
      latency: expect.stringMatching(/\d\.\d.*ms/),
    }),
    expect.stringContaining('Response sent'),
  );
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({ req: { method: 'POST', url: '/hello' } }),
    expect.stringContaining('Request received'),
  );
});

test('When middleware is connected with applyMiddleware returns still logs when error is thrown', async () => {
  const response = await getTestApplication(
    '/',
    'GET',
    (_req: Request, _res: Response, next: NextFunction) => {
      next();
      throw new InternalServerErrorException();
    },
  );
  expect(response.statusCode).toBe(500);
  expect(!!response.error).toBeTruthy();
  expect(mockInfo).toHaveBeenCalledTimes(2);
  // expect(mockInfo).toHaveBeenCalledWith(
  //   expect.objectContaining({
  //     status: 500,
  //     latency: expect.stringMatching(/\d\.\d.*ms/),
  //   }),
  //   expect.stringContaining('Response sent'),
  // );
  expect(mockInfo).toHaveBeenCalledWith(
    expect.objectContaining({ req: { method: 'GET', url: '/' } }),
    expect.stringContaining('Request received'),
  );
});
