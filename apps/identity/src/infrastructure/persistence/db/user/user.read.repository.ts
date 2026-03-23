import type { UserReadRepositoryPort } from 'apps/identity/src/domain/ports/user-read-repository.port';

import type { PrismaService } from '../../../prisma/prisma.service';

import { UserReadMapper } from './user-read.mapper';

export class UserReadRepository implements UserReadRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll() {
    const users = await this.prismaService.user.findMany();
    return users.map(user => UserReadMapper.toDto(user));
  }
}
