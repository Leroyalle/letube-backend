import type { Video } from '../../domain/entities/video.entity';

export interface CreateVideoRecord {
  video: Video;
  storage: VideoStorageData;
}

interface VideoStorageData {
  bucket: string;
}

export interface VideoRepositoryPort {
  create: (video: CreateVideoRecord) => Promise<Video>;
  findById: (id: string) => Promise<Video | null>;
  findByKey: (key: string) => Promise<Video | null>;
  update: (video: Video) => Promise<Video>;
}
