import type { MessageDto } from '@contracts/chat/dto/message.dto';
import { CHAT_PATTERNS } from '@contracts/chat/patterns/patterns';
import type { SendMessageRpcContract } from '@contracts/chat/rpc/send-message.rpc';

import { Inject, Injectable } from '@nestjs/common';

import type { BrokerEventBusPort } from '../ports/broker-event-bus.port';
import { BROKER_EVENT_BUS_TOKEN } from '../ports/token';

@Injectable()
export class ChatClientService {
  constructor(
    @Inject(BROKER_EVENT_BUS_TOKEN) private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public sendMessage(senderId: string, data: MessageDto) {
    const payload: SendMessageRpcContract = {
      content: data.content,
      senderId,
      receiverId: data.receiverId,
    };

    return this.brokerEventBus.emit(CHAT_PATTERNS.MESSAGE_CREATE, payload);
  }
}
