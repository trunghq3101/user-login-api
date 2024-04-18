import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IndefiniteLockError, TimedLockError } from 'src/errors';
import { minutesLater } from 'src/shared/utils';
import { LockDuration, User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUnlockedUser(username: string): Promise<UserDocument> {
    let user: UserDocument = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (user.lockDuration === LockDuration.Indefinitely) {
      throw new IndefiniteLockError();
    }

    if (user.lockedUntil) {
      const remainingMsUntilUnlock = await this._remainingMsUntilUnlock(user);

      if (remainingMsUntilUnlock > 0) {
        throw new TimedLockError(remainingMsUntilUnlock);
      } else {
        user = await this.unlockTimedLockUser(user);
      }
    }

    return user;
  }

  async lockUser(user: User): Promise<UserDocument> {
    let lockedUntil: Date;
    let lockDuration: LockDuration;

    switch (user.lastLockDuration) {
      case LockDuration.None:
        lockDuration = LockDuration.FiveMin;
        break;
      case LockDuration.FiveMin:
        lockDuration = LockDuration.Indefinitely;
        break;
      default:
        break;
    }
    switch (lockDuration) {
      case LockDuration.FiveMin:
        lockedUntil = minutesLater(new Date(Date.now()), 5);
        break;
      case LockDuration.Indefinitely:
        lockedUntil = null;
        break;
    }
    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        lockDuration: lockDuration,
        lockedUntil,
      },
      {
        new: true,
      },
    );
  }

  async unlockTimedLockUser(user: User): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        lockDuration: LockDuration.None,
        lockedUntil: null,
        lastLockDuration: user.lockDuration,
      },
      { new: true },
    );
  }

  private async _remainingMsUntilUnlock(user: User): Promise<number> {
    if (user.lockDuration === LockDuration.Indefinitely) {
      throw new InternalServerErrorException('User is locked indefinitely');
    }
    if (user.lockedUntil === null) {
      throw new InternalServerErrorException('User is not locked');
    }
    return user.lockedUntil.getTime() - Date.now();
  }
}
