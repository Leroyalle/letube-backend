import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyCodeDto } from '@contracts';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Post('register/send-verification-code')
  public register(@Body() dto: RegisterDto) {
    return this.authService.registerSendVerificationCode(dto);
  }

  @Post('register/verify-code')
  public registerVerifyCode(
    @Body() dto: VerifyCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.registerVerifyCode(dto, res);
  }
}
