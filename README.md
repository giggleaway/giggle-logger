# EM Logger

This module provides a logging facility.

## Getting Started

In order to get started, run `yarn add @giggleaway/giggle-logger`.

This needs to be initialized in the entry point of the application using:

```typescript
import { GiggleLogger, LogLevel } from '@giggleaway/giggle-logger';

const level: LogLevel = 'info';

GiggleLogger.initialize(level);
```

## Logging

To use the logging functionality you need to access the GiggleLogger which can provide the initialized logging object (uses [pino](https://www.npmjs.com/package/pino)). After this you can log out based on log level.

```typescript
const logger = GiggleLogger.getLogger();
logger.info('Application started');
```

### Syntactic sugar

To avoid having to continuously writing GiggleLogger.getLogger() and initializing a logger, it is recommended that you create a file wrapping this functionality.

```typescript
import { GiggleLogger, LogLevel } from '@giggleaway/giggle-logger';

const level: LogLevel = 'info';

GiggleLogger.initialize(level);

export const logger = GiggleLogger.getLogger();
```

Which turns the act of logging into the following:

```typescript
import { logger } from './logging/logger';

logger.info('application');
```

## Middleware

This package contains three middleware for NestJS. These are required for the logger to fully work. This can be added with the following:

```typescript
consumer
  .apply(requestStoreMiddleware, requestIdempotencySetter, loggerMiddleware)
  .forRoutes({ path: '*', method: RequestMethod.ALL });
```

#### loggerMiddleware

This middleware logs:

- The start and end of the request.
- The HTTP status of the request

#### requestIdempotencySetter

This middleware sets the request id from the incoming X-Request-ID or generates it if this has not been provided.

#### requestStoreMiddleware

This middleware initializes the request based store which is used by the requestIdempotencySetter and loggerMiddleware.

# Developing

### Build

To build the project use `yarn build`.

### Testing

The package uses with `Jest`. Use `yarn test` to run all tests.

### Linting

The package uses with `ESLint`. Use `yarn lint` to execute linting.
