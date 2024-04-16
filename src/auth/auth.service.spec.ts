import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/schema/user.schema';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate()', () => {
    it('returns matched user', async () => {
      const user = {};
      jest
        .spyOn(service['userModel'], 'findOne')
        .mockResolvedValue(user as any);
      const result = await service.validate('', '');
      expect(result).toBe(user);
    });

    it('returns null when user not found', async () => {
      jest.spyOn(service['userModel'], 'findOne').mockResolvedValue(null);
      const result = await service.validate('', '');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('returns token', async () => {
      const token = 'token';
      jest.spyOn(service['jwtService'], 'signAsync').mockResolvedValue(token);
      const result = await service.login({} as any);
      expect(result).toBe(token);
    });
  });
});
