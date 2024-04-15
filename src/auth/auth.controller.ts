import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
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
    const doesUserExist = await this.authService.validate(
      loginRequest.username,
      loginRequest.password,
    );
    if (!doesUserExist) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      access_token: '',
    };
  }
}
