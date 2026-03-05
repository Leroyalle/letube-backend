import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { FindByIdQuery } from '../queries/find-by-id.query';
import { Inject } from '@nestjs/common';
import { CHANNEL_REPOSITORY } from '../constants/channel-repository.token';
import type { ChannelRepository } from '../../domain/interfaces/channel.repository';

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
