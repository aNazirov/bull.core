import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() params: LoginDto) {
    return this.authService.authentication(params);
  }

  @Post('regis')
  @HttpCode(201)
  registration(@Body() params: RegistrationDto) {
    return this.authService.registration(params);
  }
}
