import type { ChannelRepository } from 'apps/channel/src/domain/interfaces/channel.repository';

import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CHANNEL_REPOSITORY } from '../constants/channel-repository.token';
import { FindByUserIdQuery } from '../queries/find-by-user-id.query';

@QueryHandler(FindByUserIdQuery)
export class FindByUserIdHandler implements IQueryHandler<FindByUserIdQuery> {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
  ) {}

  public execute(query: FindByUserIdQuery) {
    return this.channelRepository.findByUserId(query.userId);
  }
}
