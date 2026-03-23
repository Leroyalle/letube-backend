import {
  AUTH_PATTERNS,
  type ForgotPasswordDto,
  type LoginDto,
  type RegisterDto,
  type ResetPasswordDto,
  type VerifyCodeDto,
} from '@contracts/auth';

import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ConfirmEmailCommand } from '../../application/commands/confirm-email.command';
import { ConfirmPasswordResetCommand } from '../../application/commands/confirm-password-reset.command';
import { LoginCommand } from '../../application/commands/login.command';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { ResetPasswordCommand } from '../../application/commands/reset-password.command';

@Controller()
export class IdentityCommandsController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  public login(@Payload() dto: LoginDto) {
    return this.commandBus.execute(new LoginCommand(dto.email, dto.password));
  }

  @MessagePattern(AUTH_PATTERNS.REGISTER_SEND_VERIFICATION_CODE)
  public registerSendVerificationCode(dto: RegisterDto) {
    return this.commandBus.execute(
      new RegisterUserCommand({ email: dto.email, name: dto.name, password: dto.password }),
    );
  }

  @MessagePattern(AUTH_PATTERNS.REGISTER_VERIFY_CODE)
  public registerVerifyCode(dto: VerifyCodeDto) {
    return this.commandBus.execute(new ConfirmEmailCommand({ email: dto.email, code: dto.code }));
  }

  @MessagePattern(AUTH_PATTERNS.FORGOT_PASSWORD)
  public forgotPassword(@Payload() dto: ForgotPasswordDto) {
    return this.commandBus.execute(
      new ResetPasswordCommand({ email: dto.email, password: dto.password }),
    );
  }

  @MessagePattern(AUTH_PATTERNS.RESET_PASSWORD)
  public resetPassword(@Payload() dto: ResetPasswordDto) {
    return this.commandBus.execute(
      new ConfirmPasswordResetCommand({ email: dto.email, code: dto.code, password: dto.password }),
    );
  }
}
