import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VerificationCode } from 'apps/identity/__generated__/prisma';
import { ECodeType } from '@contracts';

@Injectable()
export class CodeService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    userId: string,
    type: ECodeType,
  ): Promise<VerificationCode> {
    const code = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    return await this.prisma.verificationCode.create({
      data: { userId, code, expiresAt, type },
    });
  }

  public async findByUserId(userId: string, code: string, type: ECodeType) {
    return await this.prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        type,
      },
    });
  }

  public async deleteByUserId(userId: string) {
    return await this.prisma.verificationCode.deleteMany({ where: { userId } });
  }

  public async checkExpiresAt(
    userId: string,
    code: string,
    type: ECodeType,
  ): Promise<boolean> {
    const findCode = await this.findByUserId(userId, code, type);
    if (!findCode) return false;
    return findCode.expiresAt > new Date(Date.now());
  }
}
