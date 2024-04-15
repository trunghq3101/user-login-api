import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginRequest } from './auth.dto';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validate: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get(AuthService);
  });

  describe('login', () => {
    it('should return an access token when valid credentials is provided', async () => {
      const loginRequest: LoginRequest = {
        username: 'test',
        password: 'test',
      };
      jest.spyOn(authService, 'validate').mockResolvedValue(true);

      const result = await authController.login(loginRequest);

      expect(result).toHaveProperty('access_token');
    });

    it('should throw an error when invalid credentials is provided', async () => {
      const loginRequest: LoginRequest = {
        username: 'test',
        password: 'test',
      };
      jest.spyOn(authService, 'validate').mockResolvedValue(false);

      await expect(authController.login(loginRequest)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
