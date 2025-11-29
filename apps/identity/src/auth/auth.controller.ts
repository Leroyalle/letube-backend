import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  VerifyCodeDto,
} from '@contracts';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  public login(@Payload() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @MessagePattern(AUTH_PATTERNS.REGISTER_SEND_VERIFICATION_CODE)
  public registerSendVerificationCode(dto: RegisterDto) {
    return this.authService.registerSendVerificationCode(dto);
  }

  @MessagePattern(AUTH_PATTERNS.REGISTER_VERIFY_CODE)
  public registerVerifyCode(dto: VerifyCodeDto) {
    return this.authService.registerVerifyCode(dto);
  }

  @MessagePattern(AUTH_PATTERNS.FORGOT_PASSWORD)
  public forgotPassword(@Payload() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }
}
