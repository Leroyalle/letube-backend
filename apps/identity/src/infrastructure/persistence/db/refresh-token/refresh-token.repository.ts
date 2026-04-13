import type { TokenData } from '@contracts/auth';
import type { RefreshTokenRepositoryPort } from 'apps/identity/src/domain/ports/refresh-token-repository.port';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  public async refresh(userId: string, tokenId: string, payload: TokenData) {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    await this.prismaService.refreshToken.create({
      data: {
        id: tokenId,
        tokenHash: payload.token,
        expiresAt: payload.expiresAt.expiresDate,
        userId,
      },
    });
  }

  public async find(token: string) {
    const tokenHash = token;
    return await this.prismaService.refreshToken.findFirst({
      where: {
        tokenHash,
      },
    });
  }

  public async findById(tokenId: string) {
    return await this.prismaService.refreshToken.findUnique({
      where: {
        id: tokenId,
      },
    });
  }
}
