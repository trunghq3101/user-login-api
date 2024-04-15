import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  @IsNotEmpty()
  access_token: string;
}
