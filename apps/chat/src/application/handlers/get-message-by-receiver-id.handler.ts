import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import type { ChatCacheAdapterPort } from '../ports/chat-cache-adapter.port';
import { CHAT_CACHE_ADAPTER_TOKEN } from '../ports/tokens';
import { GetMessagesByReceiverIdQuery } from '../queries/get-messages-by-receiver-id.query';

@QueryHandler(GetMessagesByReceiverIdQuery)
export class GetMessagesByReceiverIdHandler implements IQueryHandler<GetMessagesByReceiverIdQuery> {
  constructor(
    @Inject(CHAT_CACHE_ADAPTER_TOKEN) private readonly chatCacheAdapter: ChatCacheAdapterPort,
  ) {}

  public async execute(query: GetMessagesByReceiverIdQuery) {
    return await this.chatCacheAdapter.findMessages(query.props.receiverId);
  }
}
