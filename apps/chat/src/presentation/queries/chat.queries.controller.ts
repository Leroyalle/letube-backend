import { CHAT_PATTERNS } from '@contracts/chat/patterns/patterns';

import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { GetMessagesByReceiverIdQuery } from '../../application/queries/get-messages-by-receiver-id.query';

@Controller()
export class ChatQueriesController {
  constructor(private readonly queryBus: QueryBus) {}

  @MessagePattern(CHAT_PATTERNS.GET_BY_RECEIVER_ID)
  public async getByReceiverId(@Payload() data: { receiverId: string }) {
    return this.queryBus.execute(new GetMessagesByReceiverIdQuery({ receiverId: data.receiverId }));
  }
}
