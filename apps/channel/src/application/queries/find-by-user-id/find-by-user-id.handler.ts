import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { FindByUserIdQuery } from './find-by-user-id.query';
import type { ChannelRepository } from 'apps/channel/src/domain/channel.repository';
import { Inject } from '@nestjs/common';
import { CHANNEL_REPOSITORY } from '../../tokens/channel-repository.token';

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
