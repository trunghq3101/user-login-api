import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest, LoginResponse } from './auth.dto';
import { AuthService } from './auth.service';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    const userAllowedToLogin = await this.authService.attemptLogin(
      loginRequest.username,
      loginRequest.password,
    );

    const accessToken = await this.authService.login({
      username: userAllowedToLogin.username,
      id: userAllowedToLogin.id,
    });

    return {
      access_token: accessToken,
    };
  }
}
