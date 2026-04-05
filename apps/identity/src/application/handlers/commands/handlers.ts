import { ConfirmEmailHandler } from './confirm-email.handler';
import { ConfirmPasswordResetHandler } from './confirm-password-reset.handler';
import { LoginHandler } from './login.handler';
import { RegisterUserHandler } from './register-user.handler';
import { ResetPasswordHandler } from './reset-password.handler';

export const handlers = [
  ConfirmEmailHandler,
  ConfirmPasswordResetHandler,
  LoginHandler,
  RegisterUserHandler,
  ResetPasswordHandler,
];
