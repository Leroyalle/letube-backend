import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { VIDEO_REPOSITORY_READ_TOKEN } from '../../ports/tokens';
import type { VideoReadRepositoryPort } from '../../ports/video-read-repository';
import { GetAllVideosQuery } from '../../queries/get-all-videos.query';

@QueryHandler(GetAllVideosQuery)
export class GetAllVideosHandler implements IQueryHandler<GetAllVideosQuery> {
  constructor(
    @Inject(VIDEO_REPOSITORY_READ_TOKEN)
    private readonly videoReadRepository: VideoReadRepositoryPort,
  ) {}

  public execute() {
    return this.videoReadRepository.findAll();
  }
}
