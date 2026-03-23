import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import type { VerificationCodeRepositoryPort } from '../../domain/ports/verification-code-repository.port';
import type { VerificationCodeService } from '../../domain/services/verification-code.service';
import { ConfirmPasswordResetCommand } from '../commands/confirm-password-reset.command';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import {
  PASSWORD_HASHER_TOKEN,
  USER_REPOSITORY_TOKEN,
  VERIFICATION_CODE_REPOSITORY_TOKEN,
} from '../ports/tokens';

@CommandHandler(ConfirmPasswordResetCommand)
export class ConfirmPasswordResetHandler implements ICommandHandler<ConfirmPasswordResetCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepositoryPort,
    @Inject(VERIFICATION_CODE_REPOSITORY_TOKEN)
    private readonly verificationCodeRepository: VerificationCodeRepositoryPort,
    private readonly verificationCodeService: VerificationCodeService,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  public async execute(command: ConfirmPasswordResetCommand) {
    const user = await this.userRepository.findUserByEmail(command.props.email);

    if (!user) {
      throw new Error('This account is not registered.');
    }

    const foundCode = await this.verificationCodeRepository.findByUserId(
      user.props.id,
      command.props.code,
      'reset_password',
    );

    if (!foundCode) {
      throw new Error('Code not found');
    }

    const isNotExpired = this.verificationCodeService.isNotExpired(foundCode.data.expiresAt);

    if (!isNotExpired) {
      throw new Error('Code expired');
    }
    const isSame = await this.passwordHasher.verify(user.props.password, command.props.password);

    if (isSame) {
      throw new Error('Password should be not same');
    }

    const hashedPassword = await this.passwordHasher.hash(command.props.password);

    user.changePassword(hashedPassword);

    await this.userRepository.update(user);

    return { message: 'Password successfully changed!' };
  }
}
