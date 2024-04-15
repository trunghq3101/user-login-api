import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserSeed {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  logger = new Logger('UserSeed');

  async seed(userData: User[]) {
    try {
      await this.userModel.collection.drop();

      await this.userModel.create(userData);

      this.logger.log('Users seeded successfully!');
    } catch (error) {
      this.logger.error('Error seeding users:', error);
    }
  }
}
