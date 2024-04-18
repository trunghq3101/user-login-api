import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoginAttempt,
  LoginAttemptSchema,
} from 'src/login-attempt/login-attempt.schema';
import { LoginAttemptService } from './login-attempt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
    ]),
  ],
  providers: [LoginAttemptService],
  exports: [LoginAttemptService],
})
export class LoginAttemptModule {}
