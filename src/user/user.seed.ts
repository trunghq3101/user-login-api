import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserSeed {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  logger = new Logger('UserSeed');

  async seed(userData: User[]): Promise<UserDocument[]> {
    try {
      await this.userModel.collection.drop();

      const hashedUserData = await Promise.all(
        userData.map(async (user) => ({
          ...user,
          password: await bcrypt.hash(user.password, 10),
        })),
      );

      const users = await this.userModel.create(hashedUserData);

      this.logger.log('Users seeded successfully!');

      return users;
    } catch (error) {
      this.logger.error('Error seeding users:', error);
      return [];
    }
  }
}
