/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, MiddlewareConsumer, Module, NestModule, Post } from '@nestjs/common';
import { applyMiddleware } from '../../applyMiddleware';

@Controller()
export class MockController {
  @Get()
  mockGet() {}

  @Get('hello')
  mockGetHello() {}

  @Post()
  mockPost() {}

  @Post('hello')
  mockPostHello() {}
}

// Create a valid NestJS module to be used in place of the one we want to mock
@Module({ controllers: [MockController] })
export default class MockModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyMiddleware(consumer);
  }
}
