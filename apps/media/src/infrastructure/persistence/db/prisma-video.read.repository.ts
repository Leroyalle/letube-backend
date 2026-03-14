import type { VideoResponseDto } from 'apps/media/src/application/dto/video-response.dto';
import type { VideoReadRepositoryPort } from 'apps/media/src/application/ports/video-read-repository';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { VideoResponseMapper } from './video-response.mapper';

@Injectable()
export class PrismaVideoReadRepository implements VideoReadRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}
  public async findById(id: string): Promise<VideoResponseDto | null> {
    const data = await this.prismaService.video.findUnique({
      where: {
        id,
      },
    });

    if (!data) return null;

    return VideoResponseMapper.toDto(data);
  }
}
