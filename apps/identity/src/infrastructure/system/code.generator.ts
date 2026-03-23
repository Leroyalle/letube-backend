import { Injectable } from '@nestjs/common';

import type { CodeGeneratorPort } from '../../domain/ports/code-generator.port';

@Injectable()
export class CodeGenerator implements CodeGeneratorPort {
  public generate(): string {
    return crypto.randomUUID();
  }
}
