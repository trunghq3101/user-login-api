import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validate(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username, password });

    return user;
  }

  async login(user: User): Promise<string> {
    const payload = { username: user.username, sub: user.id };

    return this.jwtService.signAsync(payload);
  }
}
