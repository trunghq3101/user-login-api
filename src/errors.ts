import { BadRequestException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsError extends BadRequestException {
  constructor(remainingAttempts: number) {
    super({
      message: 'Invalid credentials.',
      error: InvalidCredentialsError.name,
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        remainingAttempts,
      },
    });
  }
}

export class TimedLockError extends BadRequestException {
  constructor(remainingTimeInMs: number) {
    super({
      message: `Too many failed attempts. Please try again after ${remainingTimeInMs}ms.`,
      error: TimedLockError.name,
      statusCode: HttpStatus.BAD_REQUEST,
      data: {
        remainingTimeInMs,
      },
    });
  }
}

export class IndefiniteLockError extends BadRequestException {
  constructor() {
    super({
      message: 'Too many failed attempts. Account is locked indefinitely.',
      error: IndefiniteLockError.name,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
