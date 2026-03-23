import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token-repository.port';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import type { VerificationCodeRepositoryPort } from '../../domain/ports/verification-code-repository.port';
import type { VerificationCodeService } from '../../domain/services/verification-code.service';
import { ConfirmEmailCommand } from '../commands/confirm-email.command';
import type { AccessTokenServicePort } from '../ports/access-token-service.port';
import type { RefreshTokenServicePort } from '../ports/refresh-token-service.port';
import {
  ACCESS_SERVICE_TOKEN,
  REFRESH_SERVICE_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
  VERIFICATION_CODE_REPOSITORY_TOKEN,
} from '../ports/tokens';

@CommandHandler(ConfirmEmailCommand)
export class ConfigEmailHandler implements ICommandHandler<ConfirmEmailCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepositoryPort,
    @Inject(VERIFICATION_CODE_REPOSITORY_TOKEN)
    private readonly verificationCodeRepository: VerificationCodeRepositoryPort,
    private readonly verificationCodeService: VerificationCodeService,
    @Inject(ACCESS_SERVICE_TOKEN)
    private readonly accessTokenService: AccessTokenServicePort,
    @Inject(REFRESH_SERVICE_TOKEN)
    private readonly refreshTokenService: RefreshTokenServicePort,
    @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  public async execute(command: ConfirmEmailCommand) {
    const user = await this.userRepository.findUserByEmail(command.props.email);

    if (!user) throw new Error('Account not found');

    const foundCode = await this.verificationCodeRepository.findByUserId(
      user.props.id,
      command.props.code,
      'verify_email',
    );

    if (!foundCode) throw new Error('Verification code not found');

    const isNotExpired = this.verificationCodeService.isNotExpired(foundCode.data.expiresAt);

    if (!isNotExpired) throw new Error('Code is over');

    const access = await this.accessTokenService.sign({
      id: user.props.id,
      email: user.props.email,
      role: user.props.role,
    });

    const refresh = await this.refreshTokenService.generateAndHash();
    await this.refreshTokenRepository.refresh(user.props.id, refresh);

    return { access, refresh };
  }
}
