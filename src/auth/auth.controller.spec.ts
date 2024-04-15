import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginRequest } from './auth.dto';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return an access token when valid login request is provided', async () => {
      const loginRequest: LoginRequest = {
        username: 'test',
        password: 'test',
      };

      const result = await authController.login(loginRequest);

      expect(result).toHaveProperty('access_token');
    });
  });
});
