import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { minutesAgo, minutesLater, mockDateOrigin } from 'src/shared/utils';
import { LockDuration, User } from 'src/user/user.schema';
import { UserService } from './user.service';

const userModel = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnlockedUser', () => {
    it('throws error if user not found', async () => {
      userModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn(),
      });
      await expect(service.getUnlockedUser('username')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('throws error if user is locked indefinitely', async () => {
      userModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue({
          lockDuration: LockDuration.Indefinitely,
        }),
      });
      await expect(service.getUnlockedUser('username')).rejects.toThrow(
        'Too many failed attempts. Account is locked. Please contact support',
      );
    });

    it('throws error if user is still locked', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => mockDateOrigin.getTime());
      userModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue({
          lockDuration: LockDuration.FiveMin,
          lockedUntil: minutesLater(new Date(Date.now()), 3),
        }),
      });

      await expect(service.getUnlockedUser('username')).rejects.toThrow(
        'Account is locked. Please try again in 180000ms',
      );
    });

    it('unlocks user if lock time is exceeded', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => mockDateOrigin.getTime());
      userModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue({
          lockDuration: LockDuration.FiveMin,
          lockedUntil: minutesAgo(new Date(Date.now()), 1),
        }),
      });
      userModel.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn(),
      });
      const unlockSpy = jest.spyOn(service, 'unlockTimedLockUser');

      await service.getUnlockedUser('username');
      expect(unlockSpy).toHaveBeenCalled();
    });
  });

  describe('lockUser', () => {
    it('locks user for 5 minutes if last lock duration is null', async () => {
      userModel.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn(),
      });
      const user = {
        id: 'id',
        lastLockDuration: LockDuration.None,
      } as any;
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => mockDateOrigin.getTime());

      await service.lockUser(user);
      expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: user.id },
        {
          lockDuration: LockDuration.FiveMin,
          lockedUntil: minutesLater(new Date(Date.now()), 5),
        },
        { new: true },
      );
    });

    it('locks user indefinitely if last lock duration is 5 minutes', async () => {
      userModel.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn(),
      });
      const user = {
        id: 'id',
        lastLockDuration: LockDuration.FiveMin,
      } as any;

      await service.lockUser(user);
      expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: user.id },
        {
          lockDuration: LockDuration.Indefinitely,
          lockedUntil: null,
        },
        { new: true },
      );
    });
  });
});
