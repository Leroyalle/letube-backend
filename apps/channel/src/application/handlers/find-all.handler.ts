import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { FindAllQuery } from '../queries/find-all.query';
import { Inject } from '@nestjs/common';
import { CHANNEL_REPOSITORY } from '../constants/channel-repository.token';
import type { ChannelRepository } from '../../domain/channel.repository';

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
