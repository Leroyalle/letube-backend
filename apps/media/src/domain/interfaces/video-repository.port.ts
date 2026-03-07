import type { Video } from '../entities/video.entity';

export interface VideoRepositoryPort {
  create: (video: Video) => Promise<Video>;
  findById: (id: string) => Promise<Video | null>;
}
