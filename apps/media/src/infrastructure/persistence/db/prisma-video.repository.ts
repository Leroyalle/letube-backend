import { Injectable } from '@nestjs/common';

import type { Video as PrismaVideo } from '../../../../__generated__/prisma';
import type {
  CreateVideoRecord,
  VideoRepositoryPort,
} from '../../../application/ports/video-repository.port';
import { Video } from '../../../domain/entities/video.entity';
import { PrismaService } from '../../prisma/prisma.service';

import { VideoMapper } from './video.mapper';

@Injectable()
export class PrismaVideoRepository implements VideoRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(record: CreateVideoRecord) {
    const persistenceVideo = VideoMapper.toCreatePersistence(record);
    const data = await this.prismaService.video.create({ data: persistenceVideo });
    return this.mapToDomain(data);
  }

  public async findById(id: string) {
    const data = await this.prismaService.video.findUnique({
      where: {
        id,
      },
    });
    return this.mapToDomain(data);
  }

  public async findByKey(key: string) {
    const data = await this.prismaService.video.findFirst({
      where: {
        sourceKey: key,
      },
    });
    return this.mapToDomain(data);
  }

  public async update(video: Video) {
    const persistenceVideo = VideoMapper.toPersistenceUpdateData(video);

    const data = await this.prismaService.video.update({
      where: {
        id: video.props.id,
      },
      data: persistenceVideo,
    });
    return this.mapToDomain(data);
  }

  private mapToDomain(data: PrismaVideo): Video;
  private mapToDomain(data: PrismaVideo | null): Video | null;
  private mapToDomain(data: PrismaVideo | null): Video | null {
    if (!data) return null;
    return VideoMapper.toDomain(data);
  }
}
