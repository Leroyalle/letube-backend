import type { VideoResponseDto } from '../dto/video-response.dto';

export interface VideoReadRepositoryPort {
  findById(id: string): Promise<VideoResponseDto | null>;
}
