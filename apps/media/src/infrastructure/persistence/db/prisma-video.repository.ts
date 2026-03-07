import { Video } from 'apps/media/src/domain/entities/video.entity';
import type { VideoRepositoryPort } from 'apps/media/src/domain/interfaces/video-repository.port';

import type { PrismaService } from '../../prisma/prisma.service';

export class PrismaVideoRepository implements VideoRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(video: Video) {
    const data = await this.prismaService.video.create({ data: video.props });
    return new Video(data);
  }

  public async findById(id: string) {
    const data = await this.prismaService.video.findUnique({
      where: {
        id,
      },
    });

    return data ? new Video(data) : null;
  }
}
