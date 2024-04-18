import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const authService = {
  attemptLogin: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('success', async () => {
      authService.attemptLogin = jest.fn().mockResolvedValue({});
      authService.login = jest.fn().mockResolvedValue('access_token');

      const result = await authController.login({
        username: 'username',
        password: 'password',
      });

      expect(result).toEqual({ accessToken: 'access_token' });
    });

    it('throws error when attemptLogin failed', async () => {
      authService.attemptLogin = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      await expect(
        authController.login({
          username: 'username',
          password: 'password',
        }),
      ).rejects.toThrow();
    });

    it('throws error when login failed', async () => {
      authService.attemptLogin = jest.fn().mockResolvedValue({});
      authService.login = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      await expect(
        authController.login({
          username: 'username',
          password: 'password',
        }),
      ).rejects.toThrow();
    });
  });
});
