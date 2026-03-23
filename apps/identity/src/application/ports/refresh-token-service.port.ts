import type { ExpiresData, SuccessLoginDto } from '@contracts/auth';

export interface RefreshTokenServicePort {
  generate(): SuccessLoginDto['refreshData'];
  generateAndHash(): Promise<SuccessLoginDto['refreshData']>;
  hash(token: string): Promise<string>;
  verify(token: string, hash: string): Promise<boolean>;
  getExpires(days: number): ExpiresData;
}
