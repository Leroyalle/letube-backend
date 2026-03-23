import type { TokenData } from '@contracts/auth';
import type { RefreshTokenRepositoryPort } from 'apps/identity/src/domain/ports/refresh-token-repository.port';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  public async refresh(userId: string, payload: TokenData) {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    await this.prismaService.refreshToken.create({
      data: {
        tokenHash: payload.token,
        expiresAt: payload.expiresAt.expiresDate,
        userId,
      },
    });
  }
}
