import type { TokenData } from '@contracts/auth';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type {
  AccessTokenServicePort,
  SignPayload,
} from '../../application/ports/access-token-service.port';

@Injectable()
export class AccessTokenService implements AccessTokenServicePort {
  private readonly accessSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret = configService.getOrThrow<string>('ACCESS_SECRET');
  }

  public async sign(payload: SignPayload): Promise<TokenData> {
    // const stringExpiresAt = '5m';
    const stringExpiresAt = '100000000m';

    const expiresMs = parseInt(stringExpiresAt) * 1000 * 60 + Date.now();
    const expiresDate = new Date(Date.now() + expiresMs);
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: expiresMs,
      secret: this.accessSecret,
    });

    return { token, expiresAt: { expiresMs, expiresDate } };
  }

  public async verify(token: string): Promise<SignPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.accessSecret,
    });
  }

  public async refresh(refreshToken: string): Promise<TokenData> {
    const payload: SignPayload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.accessSecret,
    });

    return this.sign(payload);
  }
}
