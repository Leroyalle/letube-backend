import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { VIDEO_REPOSITORY_READ_TOKEN } from '../../ports/tokens';
import type { VideoReadRepositoryPort } from '../../ports/video-read-repository';
import { GetVideoByIdQuery } from '../../queries/get-video-by-id.query';

@QueryHandler(GetVideoByIdQuery)
export class GetVideoByIdHandler implements IQueryHandler<GetVideoByIdQuery> {
  constructor(
    @Inject(VIDEO_REPOSITORY_READ_TOKEN)
    private readonly videoReadRepository: VideoReadRepositoryPort,
  ) {}

  public execute(query: GetVideoByIdQuery) {
    return this.videoReadRepository.findById(query.id);
  }
}
