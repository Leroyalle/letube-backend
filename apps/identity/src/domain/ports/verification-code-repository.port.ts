import type { CodeType, VerificationCode } from '../entities/verification-code.entity';

export interface VerificationCodeRepositoryPort {
  create(data: VerificationCode): Promise<VerificationCode>;
  findByUserId(userId: string, code: string, type: CodeType): Promise<VerificationCode | null>;
  deleteByUserId(userId: string): Promise<void>;
  checkExpiresAt(userId: string, code: string, type: CodeType): Promise<boolean>;
}
