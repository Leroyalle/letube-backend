import { AUTH_PATTERNS, type VerifyAccessTokenDto } from '@contracts/auth';

import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { VerifyAccessTokenQuery } from '../../application/queries/verify-access-token.query';

@Controller()
export class IdentityQueriesController {
  constructor(private readonly queryBus: QueryBus) {}

  @MessagePattern(AUTH_PATTERNS.VERIFY_ACCESS_TOKEN)
  public verifyAccessToken(@Payload() dto: VerifyAccessTokenDto) {
    return this.queryBus.execute(new VerifyAccessTokenQuery(dto.token));
  }
}
