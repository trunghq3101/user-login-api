import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import { LoginAttemptService } from 'src/login-attempt/login-attempt.service';
import { LockDuration } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

const userService = {
  getUnlockedUser: jest.fn(),
  lockUser: jest.fn(),
};

const jwtService = {
  signAsync: jest.fn(),
};

const loginAttemptService = {
  clear: jest.fn(),
  recordFailedAttempt: jest.fn(),
  getNumberOfConsecutiveFailedAttemptsWithin5Minutes: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  const user = {
    id: 'id',
    username: 'username',
    password: hashSync('password', 10),
    lockDuration: LockDuration.None,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: LoginAttemptService,
          useValue: loginAttemptService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('attemptLogin', () => {
    describe('user is unlocked', () => {
      it('success', async () => {
        userService.getUnlockedUser = jest.fn().mockResolvedValue(user);

        expect(await service.attemptLogin('username', 'password')).toEqual({
          id: 'id',
          username: 'username',
        });

        expect(loginAttemptService.clear).toHaveBeenCalledWith('id');
      });

      it('failed but not locked yet', async () => {
        const numberOfFailedAttempts = 2;

        userService.getUnlockedUser = jest.fn().mockResolvedValue(user);
        loginAttemptService.getNumberOfConsecutiveFailedAttemptsWithin5Minutes =
          jest.fn().mockResolvedValue(numberOfFailedAttempts);

        await expect(
          service.attemptLogin('username', 'wrongPassword'),
        ).rejects.toThrow('Invalid credentials');
      });

      it('failed and locked', async () => {
        const numberOfFailedAttempts = 3;

        userService.getUnlockedUser = jest.fn().mockResolvedValue(user);
        loginAttemptService.getNumberOfConsecutiveFailedAttemptsWithin5Minutes =
          jest.fn().mockResolvedValue(numberOfFailedAttempts);
        userService.lockUser = jest.fn().mockResolvedValue({
          ...user,
          lockDuration: LockDuration.FiveMin,
        });

        await expect(
          service.attemptLogin('username', 'wrongPassword'),
        ).rejects.toThrow(
          'Too many failed attempts. Please try again after 300000ms.',
        );
      });
    });
  });

  describe('login', () => {
    it('success', async () => {
      jwtService.signAsync = jest.fn().mockResolvedValue('token');

      expect(await service.login(user)).toBe('token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'username',
        sub: 'id',
      });
    });
  });
});
