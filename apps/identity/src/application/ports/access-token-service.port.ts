import type { TokenData } from '@contracts/auth';

import type { TRole } from '../../domain/entities/user.entity';

export interface SignPayload {
  id: string;
  email: string;
  role: TRole;
}

export interface AccessTokenServicePort {
  sign(payload: SignPayload): Promise<TokenData>;
  verify(token: string): Promise<SignPayload>;
}
