import type { ClockPort } from '@app/abstractions/system/time/clock.port';

import type { CodeGeneratorPort } from '../ports/code-generator.port';

export class VerificationCodeService {
  constructor(
    private readonly clockService: ClockPort,
    private readonly codeGenerator: CodeGeneratorPort,
  ) {}

  public generate() {
    const code = this.codeGenerator.generate();
    const expiresAt = new Date(this.clockService.now().getTime() + 5 * 60 * 1000);
    return { code, expiresAt };
  }

  public isNotExpired(expiresAt: Date) {
    return expiresAt > new Date(Date.now());
  }
}
