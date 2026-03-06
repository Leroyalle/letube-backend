import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import type { ChannelRepository } from '../../domain/interfaces/channel.repository';
import { CHANNEL_REPOSITORY } from '../constants/channel-repository.token';
import { FindByIdQuery } from '../queries/find-by-id.query';

@QueryHandler(FindByIdQuery)
export class FindByIdHandler implements IQueryHandler<FindByIdQuery> {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
  ) {}

  public execute(query: FindByIdQuery) {
    return this.channelRepository.findById(query.id);
  }
}
