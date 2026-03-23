import type { ExpiresData, SuccessLoginDto } from '@contracts/auth';
import { hash, verify } from 'argon2';
import { randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';

import type { RefreshTokenServicePort } from '../../application/ports/refresh-token-service.port';

@Injectable()
export class RefreshTokenService implements RefreshTokenServicePort {
  public async hash(token: string): Promise<string> {
    return hash(token);
  }

  public async verify(token: string, hash: string): Promise<boolean> {
    return verify(hash, token);
  }

  public generate(): SuccessLoginDto['refreshData'] {
    const token = randomBytes(34).toString('hex');
    return { token, expiresAt: this.getExpires() };
  }

  public async generateAndHash() {
    const { token, expiresAt } = this.generate();
    const hashed = await hash(token);
    return { token: hashed, expiresAt };
  }

  public getExpires(days = 30): ExpiresData {
    const expiresMs = 1000 * 60 * 60 * 24 * days;
    const expiresDate = new Date(Date.now() + expiresMs);
    return { expiresMs, expiresDate };
  }
}
