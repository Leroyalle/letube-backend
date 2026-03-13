import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import type { VideoRepositoryPort } from '../../../domain/interfaces/video-repository.port';
import { VIDEO_REPOSITORY_TOKEN } from '../../ports/tokens';
import { GetVideoByIdQuery } from '../../queries/get-video-by-id.query';

@QueryHandler(GetVideoByIdQuery)
export class GetVideoByIdHandler implements IQueryHandler<GetVideoByIdQuery> {
  constructor(
    @Inject(VIDEO_REPOSITORY_TOKEN) private readonly videoRepository: VideoRepositoryPort,
  ) {}

  public execute(query: GetVideoByIdQuery) {
    return this.videoRepository.findById(query.id);
  }
}
