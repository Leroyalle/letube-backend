import type { TokenData } from '@contracts/auth';

export interface RefreshTokenRepositoryPort {
  refresh(userId: string, payload: TokenData): Promise<void>;
}
