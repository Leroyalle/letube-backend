import type {
  CodeType,
  VerificationCode,
} from 'apps/identity/src/domain/entities/verification-code.entity';
import type { VerificationCodeRepositoryPort } from 'apps/identity/src/domain/ports/verification-code-repository.port';

import { Injectable } from '@nestjs/common';

import type { PrismaService } from '../../../prisma/prisma.service';

import { VerificationCodeMapper } from './verification-code.mapper';

@Injectable()
export class VerificationCodeRepository implements VerificationCodeRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: VerificationCode): Promise<VerificationCode> {
    const result = await this.prisma.verificationCode.create({
      data: VerificationCodeMapper.toPersistence(data),
    });

    return VerificationCodeMapper.toDomain(result);
  }

  public async findByUserId(userId: string, code: string, type: CodeType) {
    const result = await this.prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        type,
      },
    });

    if (!result) return null;

    return VerificationCodeMapper.toDomain(result);
  }

  public async deleteByUserId(userId: string) {
    await this.prisma.verificationCode.deleteMany({ where: { userId } });
  }
}
