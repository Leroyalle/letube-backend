import { RefreshTokenRepositoryPort } from 'apps/identity/src/domain/ports/refresh-token-repository.port';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { RefreshCommand } from '../../commands/refresh.command';
import { AccessTokenServicePort } from '../../ports/access-token-service.port';
// import { RefreshTokenServicePort } from '../../ports/refresh-token-service.port';
import { ACCESS_SERVICE_TOKEN, REFRESH_TOKEN_REPOSITORY_TOKEN } from '../../ports/tokens';

@CommandHandler(RefreshCommand)
export class refreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    @Inject(ACCESS_SERVICE_TOKEN)
    private readonly accessTokenService: AccessTokenServicePort,
    @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  public async execute(command: RefreshCommand) {
    // const refreshTokenRecord = await this.refreshTokenService.console.log(
    //   'dsasdadsasdadsdas',
    //   command,
    // );
    return await this.accessTokenService.refresh(command.props.refreshToken);
  }
}
