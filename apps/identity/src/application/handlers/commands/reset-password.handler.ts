import type { SendMessageDto } from '@contracts/notification';
import { NOTIFICATION_BROKER_QUEUES } from '@contracts/notification/queues/broker.queues';
import { randomUUID } from 'crypto';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { VerificationCode } from '../../../domain/entities/verification-code.entity';
import type { UserRepositoryPort } from '../../../domain/ports/user-repository.port';
import type { VerificationCodeRepositoryPort } from '../../../domain/ports/verification-code-repository.port';
import type { VerificationCodeService } from '../../../domain/services/verification-code.service';
import { ResetPasswordCommand } from '../../commands/reset-password.command';
import type { BrokerEventBusPort } from '../../ports/broker-event-bus.port';
import {
  BROKER_EVENT_BUS_TOKEN,
  USER_REPOSITORY_TOKEN,
  VERIFICATION_CODE_REPOSITORY_TOKEN,
} from '../../ports/tokens';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepositoryPort,
    @Inject(VERIFICATION_CODE_REPOSITORY_TOKEN)
    private readonly verificationCodeRepository: VerificationCodeRepositoryPort,
    private readonly verificationCodeService: VerificationCodeService,
    @Inject(BROKER_EVENT_BUS_TOKEN)
    private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public async execute(command: ResetPasswordCommand) {
    const user = await this.userRepository.findUserByEmail(command.props.email);

    if (!user) {
      throw new Error('This account is not registered.');
    }

    const codeData = this.verificationCodeService.generate();

    const codeEntity = VerificationCode.create({
      id: randomUUID(),
      code: codeData.code,
      expiresAt: codeData.expiresAt,
      type: 'reset_password',
      userId: user.props.id,
    });

    await this.verificationCodeRepository.create(codeEntity);

    const sendData: SendMessageDto = {
      message: `Your Reset Code is ${codeData.code}`,
      subject: 'Reset password code',
      to: [user.props.email],
      type: 'AUTH',
    };

    this.brokerEventBus.emit(NOTIFICATION_BROKER_QUEUES.SEND_MESSAGE, sendData);

    return { message: 'V-code has been sent to ur email' };
  }
}
