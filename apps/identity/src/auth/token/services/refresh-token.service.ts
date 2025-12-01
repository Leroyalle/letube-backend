import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { ExpiresData, SuccessLoginDto } from '@contracts/auth';

@Injectable()
export class RefreshTokenService {
  public generate(): SuccessLoginDto['refreshData'] {
    return {
      token: crypto.randomBytes(64).toString('hex'),
      expiresAt: this.getExpires(),
    };
  }

  public hash(token: string): Promise<string> {
    return argon2.hash(token);
  }

  public generateAndHash(): Promise<string> {
    return this.hash(this.generate().token);
  }

  public verify(token: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, token);
  }

  public getExpires(days = 30): ExpiresData {
    const expiresMs = 1000 * 60 * 60 * 24 * days;
    const expiresDate = new Date(Date.now() + expiresMs);
    return { expiresMs, expiresDate };
  }
}
