import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { SendMessageCommand } from '../commands/send-message.command';
import type { MailerAdapterPort } from '../ports/mailer-adapter.port';
import { MAILER_ADAPTER_TOKEN } from '../ports/tokens';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(@Inject(MAILER_ADAPTER_TOKEN) private readonly mailerAdapter: MailerAdapterPort) {}

  public async execute(command: SendMessageCommand) {
    return this.mailerAdapter.sendMessage({
      message: command.props.message,
      subject: command.props.subject,
      to: command.props.to,
      type: command.props.type,
    });
  }
}
