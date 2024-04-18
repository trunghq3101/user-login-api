import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginAttempt } from 'src/login-attempt/login-attempt.schema';
import { LoginAttemptService } from './login-attempt.service';

const loginAttemptModel = {
  create: jest.fn(),
  find: jest.fn(),
  deleteMany: jest.fn(),
};

describe('LoginAttemptsService', () => {
  let service: LoginAttemptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginAttemptService,
        {
          provide: getModelToken(LoginAttempt.name),
          useValue: loginAttemptModel,
        },
      ],
    }).compile();

    service = module.get<LoginAttemptService>(LoginAttemptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordFailedAttempt', () => {
    it('success', async () => {
      const userId = 'userId';
      await service.recordFailedAttempt(userId);
      expect(loginAttemptModel.create).toHaveBeenCalledWith({ userId });
    });
  });

  describe('getNumberOfConsecutiveFailedAttemptsWithin5Minutes', () => {
    it('success', async () => {
      const userId = 'userId';
      const attempts = [{}, {}];
      loginAttemptModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue(attempts),
      });
      const result =
        await service.getNumberOfConsecutiveFailedAttemptsWithin5Minutes(
          userId,
        );
      expect(result).toBe(attempts.length);
    });
  });

  describe('clear', () => {
    it('success', async () => {
      const userId = 'userId';
      await service.clear(userId);
      expect(loginAttemptModel.deleteMany).toHaveBeenCalledWith({ userId });
    });
  });
});
