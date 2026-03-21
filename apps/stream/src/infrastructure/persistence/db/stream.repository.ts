import type { Stream } from 'apps/stream/src/domain/entities/stream.entity';
import type { StreamRepositoryPort } from 'apps/stream/src/domain/ports/stream-repository.port';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { StreamMapper } from './stream.mapper';

@Injectable()
export class StreamRepository implements StreamRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(data: Stream): Promise<Stream> {
    const persistence = StreamMapper.toPersistence(data);
    const stream = await this.prismaService.stream.create({
      data: persistence,
    });
    return StreamMapper.toDomain(stream);
  }

  public async delete(id: string): Promise<void> {
    await this.prismaService.stream.delete({
      where: {
        id,
      },
    });
  }

  public async update(data: Stream): Promise<void> {
    const persistence = StreamMapper.toPersistence(data);
    await this.prismaService.stream.update({
      where: {
        id: persistence.id,
      },
      data: persistence,
    });
  }

  public async findByChannelId(channelId: string): Promise<Stream | null> {
    const stream = await this.prismaService.stream.findFirst({
      where: {
        channelId,
      },
    });

    if (!stream) return null;

    return StreamMapper.toDomain(stream);
  }

  public async findByStreamKey(streamKey: string): Promise<Stream | null> {
    const stream = await this.prismaService.stream.findFirst({
      where: {
        streamKey,
      },
    });

    if (!stream) return null;

    return StreamMapper.toDomain(stream);
  }
}
