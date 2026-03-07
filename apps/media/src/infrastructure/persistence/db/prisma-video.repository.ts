import { Video } from 'apps/media/src/domain/entities/video.entity';
import type { VideoRepositoryPort } from 'apps/media/src/domain/interfaces/video-repository.port';

import { Injectable } from '@nestjs/common';

import type { Video as PrismaVideo } from '../../../../__generated__/prisma';
import { PrismaService } from '../../prisma/prisma.service';

import { VideoMapper } from './video.mapper';

@Injectable()
export class PrismaVideoRepository implements VideoRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(video: Video) {
    const data = await this.prismaService.video.create({ data: video.props });
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
    const data = await this.prismaService.video.update({
      where: {
        id: video.props.id,
      },
      data: video.props,
    });
    return this.mapToDomain(data);
  }

  private mapToDomain(data: PrismaVideo): Video;
  private mapToDomain(data: PrismaVideo | null): Video | null;
  private mapToDomain(data: PrismaVideo | null): Video | null {
    if (!data) return null;
    const domainData = VideoMapper.toDomain(data);
    return new Video(domainData);
  }
}
