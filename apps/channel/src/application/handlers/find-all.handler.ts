import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import type { ChannelRepository } from '../../domain/interfaces/channel.repository';
import { CHANNEL_REPOSITORY } from '../constants/channel-repository.token';
import { FindAllQuery } from '../queries/find-all.query';

@QueryHandler(FindAllQuery)
export class FindAllHandler implements IQueryHandler<FindAllQuery> {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
  ) {}

  public execute() {
    return this.channelRepository.findAll();
  }
}
