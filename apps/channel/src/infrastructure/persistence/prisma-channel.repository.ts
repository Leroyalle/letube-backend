import { Injectable } from '@nestjs/common';
import type { ChannelRepository } from '../../domain/interfaces/channel.repository';
import { PrismaService } from '../prisma/prisma.service';
import type { Channel } from '../../domain/entities/channel.entity';
import { ChannelMapper } from './channel.mapper';

@Injectable()
export class PrismaChannelRepository implements ChannelRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public create(data: Channel) {
    return this.prismaService.channel.create({
      data: ChannelMapper.toPersistence(data),
    });
  }

  public remove(id: string) {
    return this.prismaService.channel.delete({
      where: {
        id,
      },
    });
  }

  public findByUserId(userId: string) {
    return this.prismaService.channel.findUnique({
      where: {
        userId,
      },
    });
  }

  public findAll() {
    return this.prismaService.channel.findMany();
  }

  public findById(id: string) {
    return this.prismaService.channel.findUnique({
      where: {
        id,
      },
    });
  }
}
