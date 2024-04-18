import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserSeed {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  logger = new Logger('UserSeed');

  async seed(userData: User[]): Promise<UserDocument[]> {
    try {
      await this.userModel.collection.drop();

      const users = await this.userModel.create(userData);

      this.logger.log('Users seeded successfully!');

      return users;
    } catch (error) {
      this.logger.error('Error seeding users:', error);
      return [];
    }
  }
}
