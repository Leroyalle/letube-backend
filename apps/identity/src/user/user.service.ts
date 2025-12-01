import { CreateUserDto, UpdateUserDto } from '@contracts/user';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'apps/identity/__generated__/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: CreateUserDto): Promise<User | undefined> {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      console.log('[UserService_create]', error);
    }
  }

  public async update(dto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id: dto.id },
        data: dto,
      });
    } catch (error) {
      console.log('UserService_update', error);
    }
  }

  public async findById(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log('[UserService_findById]', error);
    }
  }

  public findByEmail(email: string) {
    try {
      return this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      console.log('[UserService_findByEmail]', error);
    }
  }
}
