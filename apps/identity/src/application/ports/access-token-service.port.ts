import type { TokenData } from '@contracts/auth';
import type { EUserRole } from '@contracts/user';

export interface SignPayload {
  id: string;
  email: string;
  role: EUserRole;
}

export interface AccessTokenServicePort {
  sign(payload: SignPayload): Promise<TokenData>;
  verify(token: string): Promise<SignPayload>;
}
