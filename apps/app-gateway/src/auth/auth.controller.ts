import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyCodeDto,
} from '@contracts/auth';
import { Request, Response } from 'express';

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
  public registerVerifyCode(@Body() dto: VerifyCodeDto, @Res() res: Response) {
    return this.authService.registerVerifyCode(dto, res);
  }

  @Post('forgot-password')
  public forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  public resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('google')
  public googleLogin(@Res() Res: Response) {
    return this.authService.googleLogin(Res);
  }

  @Get('google/callback')
  public googleCallback(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleCallback(req, res);
  }
}
