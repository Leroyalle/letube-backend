import type { VerificationCode as PersistenceCode } from 'apps/identity/__generated__/prisma';
import { VerificationCode as DomainCode } from 'apps/identity/src/domain/entities/verification-code.entity';
import { randomUUID } from 'crypto';

function isCodeTypeKey(value: string): value is keyof typeof CODE_TYPE_MAP {
  return value in CODE_TYPE_MAP;
}

const CODE_TYPE_MAP = {
  reset_password: 'reset_password',
  verify_email: 'verify_email',
} as const;

export class VerificationCodeMapper {
  public static toDomain(data: PersistenceCode): DomainCode {
    const { type, expiresAt, code } = data;

    if (!isCodeTypeKey(type)) {
      throw new Error('Invalid code type');
    }

    return DomainCode.create({
      id: randomUUID(),
      userId: data.userId,
      type,
      expiresAt,
      code,
    });
  }

  public static toPersistence(code: DomainCode): PersistenceCode {
    return {
      code: code.data.code,
      expiresAt: code.data.expiresAt,
      type: CODE_TYPE_MAP[code.data.type],
      createdAt: new Date(),
      id: code.data.id,
      userId: code.data.userId,
    };
  }
}
