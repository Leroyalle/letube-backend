export const AUTH_PATTERNS = {
  LOGIN: {
    cmd: 'auth.login',
  },
  LOGOUT: {
    cmd: 'auth.logout',
  },
  REGISTER_SEND_VERIFICATION_CODE: {
    cmd: 'auth.register_send_verification_code',
  },
  REGISTER_VERIFY_CODE: {
    cmd: 'auth.register_verify_code',
  },
  REFRESH_TOKEN: {
    cmd: 'auth.refresh-token',
  },
  FORGOT_PASSWORD: {
    cmd: 'auth.forgot-password',
  },
  RESET_PASSWORD: {
    cmd: 'auth.reset-password',
  },
};
