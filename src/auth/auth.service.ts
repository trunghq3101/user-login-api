import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async validate(
    username: string,
    password: string,
    user?: User,
  ): Promise<boolean> {
    if (user) {
      return user.username === username && user.password === password;
    }

    user = await this.userModel.findOne({ username, password });

    return user !== null;
  }
}
