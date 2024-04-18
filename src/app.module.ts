import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoginAttemptModule } from './login-attempt/login-attempt.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SharedModule, AuthModule, LoginAttemptModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
