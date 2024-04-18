import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAttempt } from './login-attempt.schema';

@Injectable()
export class LoginAttemptsSeed {
  constructor(
    @InjectModel(LoginAttempt.name)
    private loginAttemptModel: Model<LoginAttempt>,
  ) {}

  logger = new Logger('LoginAttemptSeed');

  async seed(loginAttemptData: LoginAttempt[]) {
    try {
      await this.loginAttemptModel.collection.drop();

      await this.loginAttemptModel.create(loginAttemptData);

      this.logger.log('LoginAttempts seeded successfully!');
    } catch (error) {
      this.logger.error('Error seeding login attempts:', error);
    }
  }
}
