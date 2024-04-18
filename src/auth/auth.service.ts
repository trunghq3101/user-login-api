import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAttemptService } from 'src/login-attempt/login-attempt.service';
import { LockDuration, User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

export enum LoginAttemptValidationResult {
  Valid,
  Invalid,
  TooManyFailedAttempts,
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly loginAttemptService: LoginAttemptService,
  ) {}

  async attemptLogin(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const unlockedUser = await this.userService.getUnlockedUser(username);

    if (unlockedUser.lockDuration) {
      throw new Error('User should be unlocked');
    }

    const passwordMatched = unlockedUser.password == password;

    // Success attempt
    if (passwordMatched) {
      await this.loginAttemptService.clear(unlockedUser.id);
      return {
        username: unlockedUser.username,
        id: unlockedUser.id,
      };
    }

    // Failed attempt
    await this.loginAttemptService.recordFailedAttempt(unlockedUser.id);

    const numberOfConsecutiveFailedAttemptsWithin5Minutes =
      await this.loginAttemptService.getNumberOfConsecutiveFailedAttemptsWithin5Minutes(
        unlockedUser.id,
      );

    // Not locked yet
    if (numberOfConsecutiveFailedAttemptsWithin5Minutes < 3) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Lock user
    if (unlockedUser.lockDuration === LockDuration.None) {
      const lockedUser = await this.userService.lockUser(unlockedUser);
      if (lockedUser.lockDuration === LockDuration.None) {
        throw new Error('User should be locked');
      }
      await this.loginAttemptService.clear(lockedUser.id);
    }
    throw new UnauthorizedException(
      'Too many failed attempts. Account is locked',
    );
  }

  async login(user: Partial<User>): Promise<string> {
    const payload = { username: user.username, sub: user.id };

    return this.jwtService.signAsync(payload);
  }
}
