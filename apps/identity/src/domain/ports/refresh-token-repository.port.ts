import type { TokenData } from '@contracts/auth';

export interface RefreshTokenRepositoryPort {
  refresh(userId: string, tokenId: string, payload: TokenData): Promise<void>;
  find(token: string): Promise<{ tokenHash: string; expiresAt: Date; userId: string } | null>;
  findById(tokenId: string): Promise<{ tokenHash: string; expiresAt: Date; userId: string } | null>;
}
