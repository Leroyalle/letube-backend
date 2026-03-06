import { TokenData } from '@contracts/auth';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

import { SignDto } from '../dto/sign.dto';

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signAccessToken(payload: SignDto): Promise<TokenData> {
    const stringExpiresAt = '5m';

    const expiresMs = parseInt(stringExpiresAt) * 1000 * 60 + Date.now();
    const expiresDate = new Date(Date.now() + expiresMs);
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('ACCESS_SECRET'),
      expiresIn: '5m',
    });
    return { token, expiresAt: { expiresMs, expiresDate } };
  }

  // FIXME: типизировать return
  public verifyAccessToken(token: string): SignDto {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>('ACCESS_SECRET'),
      });
    } catch (error) {
      console.log('AccessTokenService_verifyAccessToken', error);
      throw new RpcException('Invalid token');
    }
  }
}
