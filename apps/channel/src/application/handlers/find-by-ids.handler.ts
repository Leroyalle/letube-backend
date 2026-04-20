import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import type { ChannelRepository } from '../../domain/interfaces/channel.repository';
import { CHANNEL_REPOSITORY } from '../constants/channel-repository.token';
import { FindByIdsQuery } from '../queries/find-by-ids.query';

@QueryHandler(FindByIdsQuery)
export class FindByIdsHandler implements IQueryHandler<FindByIdsQuery> {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
  ) {}

  public execute(query: FindByIdsQuery) {
    return this.channelRepository.findByIds(query.ids);
  }
}
