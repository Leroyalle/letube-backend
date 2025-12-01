import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import {
  CreateChannelDto,
  FindByIdDto,
  FindByUserIdDto,
} from '@contracts/channel';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}
  public async findByUserId(dto: FindByUserIdDto) {
    return await this.prisma.channel.findUnique({
      where: { userId: dto.userId },
    });
  }

  public async create(dto: CreateChannelDto) {
    return await this.prisma.channel.create({ data: dto });
  }

  public async findAll() {
    return await this.prisma.channel.findMany();
  }

  public async findById(dto: FindByIdDto) {
    return await this.prisma.channel.findUnique({ where: { id: dto.id } });
  }
}
