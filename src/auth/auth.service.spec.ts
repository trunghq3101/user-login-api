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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate()', () => {
    it('returns true when user is provided and credentials match', async () => {
      const user = { username: 'test', password: 'test' };
      const result = await service.validate('test', 'test', user);
      expect(result).toBe(true);
    });

    it('returns false when user is provided and credentials do not match', async () => {
      const user = { username: 'test', password: 'test' };
      const result = await service.validate('test', 'wrong', user);
      expect(result).toBe(false);
    });

    it('returns true when user is not provided and it finds a matched user', async () => {
      const user = {};
      jest
        .spyOn(service['userModel'], 'findOne')
        .mockResolvedValue(user as any);
      const result = await service.validate('', '');
      expect(result).toBe(true);
    });

    it('returns false when user is not provided and it cannot find a matched user', async () => {
      jest.spyOn(service['userModel'], 'findOne').mockResolvedValue(null);
      const result = await service.validate('', '');
      expect(result).toBe(false);
    });
  });
});
