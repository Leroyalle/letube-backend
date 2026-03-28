import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import type { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token-repository.port';
import type { UserRepositoryPort } from '../../../domain/ports/user-repository.port';
import { LoginCommand } from '../../commands/login.command';
import type { AccessTokenServicePort } from '../../ports/access-token-service.port';
import type { PasswordHasherPort } from '../../ports/password-hasher.port';
import type { RefreshTokenServicePort } from '../../ports/refresh-token-service.port';
import {
  ACCESS_SERVICE_TOKEN,
  PASSWORD_HASHER_TOKEN,
  REFRESH_SERVICE_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '../../ports/tokens';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_TOKEN) private readonly passwordHasher: PasswordHasherPort,
    @Inject(ACCESS_SERVICE_TOKEN) private readonly accessTokenService: AccessTokenServicePort,
    @Inject(REFRESH_SERVICE_TOKEN) private readonly refreshTokenService: RefreshTokenServicePort,
    @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  public async execute(command: LoginCommand) {
    const user = await this.userRepository.findUserByEmail(command.email);

    if (!user) throw new Error('This account is not registered.');

    const isPasswordValid = await this.passwordHasher.verify(user.props.password, command.password);

    if (!isPasswordValid) throw new Error('Invalid credentials');

    const access = await this.accessTokenService.sign({
      id: user.props.id,
      email: user.props.email,
      role: user.props.role,
    });

    const refresh = await this.refreshTokenService.generateAndHash();

    await this.refreshTokenRepository.refresh(user.props.id, {
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    await this.userRepository.update(user);

    return { access, refresh };
  }
}
