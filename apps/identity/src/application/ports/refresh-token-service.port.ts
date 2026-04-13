import type { ExpiresData } from '@contracts/auth';

export interface RefreshTokenServicePort {
  generate(): { tokenId: string; token: string; tokenSecret: string };
  hash(token: string): Promise<string>;
  verify(token: string, hash: string): Promise<boolean>;
  getExpires(days: number): ExpiresData;
}
