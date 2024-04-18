import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoginAttempt,
  LoginAttemptSchema,
} from 'src/login-attempt/login-attempt.schema';
import { LoginAttemptsSeed } from 'src/login-attempt/login-attempt.seed';
import { SharedModule } from 'src/shared/shared.module';
import { User, UserSchema } from 'src/user/user.schema';
import { UserSeed } from 'src/user/user.seed';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
    ]),
  ],
  providers: [UserSeed, LoginAttemptsSeed],
  exports: [UserSeed, LoginAttemptsSeed],
})
export class SeedsModule {}
