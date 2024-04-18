import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAttempt } from 'src/login-attempt/login-attempt.schema';
import { minutesAgoFromNow } from 'src/shared/utils';

@Injectable()
export class LoginAttemptService {
  constructor(
    @InjectModel(LoginAttempt.name)
    private readonly loginAttemptsModel: Model<LoginAttempt>,
  ) {}

  async recordFailedAttempt(userId: string): Promise<void> {
    await this.loginAttemptsModel.create({ userId });
  }

  async getNumberOfConsecutiveFailedAttemptsWithin5Minutes(
    userId: string,
  ): Promise<number> {
    const attempts = await this.loginAttemptsModel
      .find({
        userId,
        createdAt: { $gte: minutesAgoFromNow(5) },
      })
      .sort({ createdAt: -1 });
    return attempts.length;
  }

  async clear(userId: string): Promise<void> {
    await this.loginAttemptsModel.deleteMany({
      userId,
    });
  }
}
