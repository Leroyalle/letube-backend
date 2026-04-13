import { RefreshTokenRepositoryPort } from 'apps/identity/src/domain/ports/refresh-token-repository.port';
import { UserRepositoryPort } from 'apps/identity/src/domain/ports/user-repository.port';
import { VerificationCodeRepositoryPort } from 'apps/identity/src/domain/ports/verification-code-repository.port';
import { VerificationCodeService } from 'apps/identity/src/domain/services/verification-code.service';
import { UserPublicMapper } from 'apps/identity/src/infrastructure/persistence/db/user/user-public.mapper';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ConfirmEmailCommand } from '../../commands/confirm-email.command';
import { AccessTokenServicePort } from '../../ports/access-token-service.port';
import { RefreshTokenServicePort } from '../../ports/refresh-token-service.port';
import {
  ACCESS_SERVICE_TOKEN,
  REFRESH_SERVICE_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
  VERIFICATION_CODE_REPOSITORY_TOKEN,
} from '../../ports/tokens';

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailHandler implements ICommandHandler<ConfirmEmailCommand> {
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

    user.props.isVerified = true;

    await this.userRepository.update(user);
    const accessData = await this.accessTokenService.sign({
      id: user.props.id,
      email: user.props.email,
      role: user.props.role,
    });

    const refreshToken = this.refreshTokenService.generate();
    const refreshTokenHash = await this.refreshTokenService.hash(refreshToken.tokenSecret);
    const expiresAt = this.refreshTokenService.getExpires(30);

    await this.refreshTokenRepository.refresh(user.props.id, refreshToken.tokenId, {
      token: refreshTokenHash,
      expiresAt: expiresAt,
    });
    const userMapped = UserPublicMapper.toPublic(user);

    void this.verificationCodeRepository.deleteByUserId(user.props.id);
    return { accessData, refreshData: { token: refreshToken.token, expiresAt }, user: userMapped };
  }
}
