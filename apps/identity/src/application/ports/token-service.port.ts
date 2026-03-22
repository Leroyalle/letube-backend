import type { TokenData } from '@contracts/auth';
import type { EUserRole } from '@contracts/user';

export interface SignPayload {
  id: string;
  email: string;
  role: EUserRole;
}

export interface TokenServicePort {
  sign(payload: SignPayload): Promise<TokenData>;
  verify(token: string): Promise<SignPayload>;
}
