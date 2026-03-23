import type { SendMessageDto } from '@contracts/notification';
import { NOTIFICATION_BROKER_QUEUES } from '@contracts/notification/queues/broker.queues';
import { randomUUID } from 'crypto';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { User } from '../../../domain/entities/user.entity';
import { VerificationCode } from '../../../domain/entities/verification-code.entity';
import type { UserRepositoryPort } from '../../../domain/ports/user-repository.port';
import type { VerificationCodeRepositoryPort } from '../../../domain/ports/verification-code-repository.port';
import type { VerificationCodeService } from '../../../domain/services/verification-code.service';
import { RegisterUserCommand } from '../../commands/register-user.command';
import type { BrokerEventBusPort } from '../../ports/broker-event-bus.port';
import type { PasswordHasherPort } from '../../ports/password-hasher.port';
import {
  BROKER_EVENT_BUS_TOKEN,
  PASSWORD_HASHER_TOKEN,
  USER_REPOSITORY_TOKEN,
  VERIFICATION_CODE_REPOSITORY_TOKEN,
} from '../../ports/tokens';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_TOKEN) private readonly passwordHasher: PasswordHasherPort,
    @Inject(VERIFICATION_CODE_REPOSITORY_TOKEN)
    private readonly verificationCodeRepository: VerificationCodeRepositoryPort,
    private readonly verificationCodeService: VerificationCodeService,
    @Inject(BROKER_EVENT_BUS_TOKEN)
    private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public async execute(command: RegisterUserCommand) {
    const foundUser = await this.userRepository.findUserByEmail(command.props.email);

    if (foundUser) throw new Error('User has already exists');

    const hashedPassword = await this.passwordHasher.hash(command.props.password);

    const user = User.create({
      email: command.props.email,
      password: hashedPassword,
      id: randomUUID(),
      isBanned: false,
      name: command.props.name,
      role: 'USER',
      isVerified: false,
    });

    await this.userRepository.create(user);

    const codeData = this.verificationCodeService.generate();

    const verificationCode = VerificationCode.create({
      id: randomUUID(),
      code: codeData.code,
      expiresAt: codeData.expiresAt,
      type: 'verify_email',
      userId: user.props.id,
    });

    await this.verificationCodeRepository.create(verificationCode);

    const sendData: SendMessageDto = {
      message: `Your code is ${codeData.code}`,
      subject: 'Verification code',
      to: [user.props.email],
      type: 'AUTH',
    };

    this.brokerEventBus.emit(NOTIFICATION_BROKER_QUEUES.SEND_MESSAGE, sendData);

    return { message: 'V-code has been sent to ur email. Don`t forget to check ur spam folder' };
  }
}
