import { User as DomainUser } from 'apps/identity/src/domain/entities/user.entity';
import type { UserRepositoryPort } from 'apps/identity/src/domain/ports/user-repository.port';

import { Injectable } from '@nestjs/common';

import type { PrismaService } from '../../../prisma/prisma.service';

import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prismaService: PrismaService) {}

  public async findUserByEmail(email: string): Promise<DomainUser | null> {
    const data = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!data) return null;

    return UserMapper.toDomain(data);
  }

  public async findById(id: string) {
    const data = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!data) return null;

    return UserMapper.toDomain(data);
  }

  public async create(data: DomainUser): Promise<DomainUser> {
    const persistence = UserMapper.toPersistence(data);

    const user = await this.prismaService.user.create({
      data: persistence,
    });

    return UserMapper.toDomain(user);
  }

  public async update(data: DomainUser): Promise<void> {
    const persistence = UserMapper.toPersistence(data);

    await this.prismaService.user.update({
      where: {
        id: persistence.id,
      },
      data: persistence,
    });
  }
}
