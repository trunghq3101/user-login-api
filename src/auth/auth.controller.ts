import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest, LoginResponse } from './auth.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return {
      access_token: '',
    };
  }
}
