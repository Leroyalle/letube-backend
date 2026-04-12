import { ConfirmEmailHandler } from './confirm-email.handler';
import { ConfirmPasswordResetHandler } from './confirm-password-reset.handler';
import { LoginHandler } from './login.handler';
import { refreshHandler } from './refresh.handler';
import { RegisterUserHandler } from './register-user.handler';
import { ResetPasswordHandler } from './reset-password.handler';

export const commands = [
  ConfirmEmailHandler,
  ConfirmPasswordResetHandler,
  LoginHandler,
  RegisterUserHandler,
  ResetPasswordHandler,
  refreshHandler,
];
