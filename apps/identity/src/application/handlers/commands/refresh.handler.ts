import { RefreshTokenRepositoryPort } from 'apps/identity/src/domain/ports/refresh-token-repository.port';
import { UserRepositoryPort } from 'apps/identity/src/domain/ports/user-repository.port';

import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { RefreshCommand } from '../../commands/refresh.command';
import { AccessTokenServicePort } from '../../ports/access-token-service.port';
import { RefreshTokenServicePort } from '../../ports/refresh-token-service.port';
// import { RefreshTokenServicePort } from '../../ports/refresh-token-service.port';
import {
  ACCESS_SERVICE_TOKEN,
  REFRESH_SERVICE_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '../../ports/tokens';

@CommandHandler(RefreshCommand)
export class refreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    @Inject(ACCESS_SERVICE_TOKEN)
    private readonly accessTokenService: AccessTokenServicePort,
    @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(REFRESH_SERVICE_TOKEN) private readonly refreshTokenService: RefreshTokenServicePort,
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepositoryPort,
  ) {}

  public async execute(command: RefreshCommand) {
    const refreshToken = command.props.refreshToken;

    const [tokenId, tokenSecret] = refreshToken.split('.');
    const session = await this.refreshTokenRepository.findById(tokenId);
    if (!session) throw new UnauthorizedException('Invalid refresh token');

    const isValid = await this.refreshTokenService.verify(tokenSecret, session.tokenHash);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userRepository.findById(session.userId);
    if (!user) throw new UnauthorizedException('User not found');

    return this.accessTokenService.sign({
      id: user.props.id,
      email: user.props.email,
      role: user.props.role,
    });
  }

  // const refreshTokenRecord = await this.refreshTokenService.console.log(
  //   'dsasdadsasdadsdas',
  //   command,
  // );
}
