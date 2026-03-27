import { CHAT_PATTERNS } from '@contracts/chat/patterns/patterns';
import type { SendMessageRpcContract } from '@contracts/chat/rpc/send-message.rpc';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import type { BrokerEventBusPort } from '../../ports/broker-event-bus.port';
import { BROKER_EVENT_BUS_TOKEN } from '../../ports/token';

import { SendMessageCommand } from './send-message.command';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  constructor(
    @Inject(BROKER_EVENT_BUS_TOKEN) private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public async execute(command: SendMessageCommand) {
    const payload: SendMessageRpcContract = {
      content: command.props.content,
      senderId: '123123',
      receiverId: command.props.receiverId,
    };

    this.brokerEventBus.emit(CHAT_PATTERNS.MESSAGE_CREATE, payload);

    return Promise.resolve();
  }
}
