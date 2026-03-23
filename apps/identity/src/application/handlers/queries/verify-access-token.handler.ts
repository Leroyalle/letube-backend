import type { VerifyAccessTokenDto } from '@contracts/auth';
import type { VerifyAccessTokenResponse } from '@contracts/auth/dto/verify-access/verify-access-token-response.dto';
import type { UserRepositoryPort } from 'apps/identity/src/domain/ports/user-repository.port';

import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import type { AccessTokenServicePort } from '../../ports/access-token-service.port';
import { ACCESS_SERVICE_TOKEN, USER_REPOSITORY_TOKEN } from '../../ports/tokens';
import { VerifyAccessTokenQuery } from '../../queries/verify-access-token.query';

@QueryHandler(VerifyAccessTokenQuery)
export class VerifyAccessTokenHandler implements IQueryHandler<VerifyAccessTokenQuery> {
  constructor(
    @Inject(ACCESS_SERVICE_TOKEN) private readonly accessTokenService: AccessTokenServicePort,
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepositoryPort,
  ) {}

  public async execute(dto: VerifyAccessTokenDto): Promise<VerifyAccessTokenResponse> {
    const payload = await this.accessTokenService.verify(dto.token);
    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      email: user.props.email,
      name: user.props.name,
      id: user.props.id,
      role: user.props.role,
    };
  }
}
