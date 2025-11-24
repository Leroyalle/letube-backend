import { CreateUserDto } from '@contracts';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User } from '../__generated__/prisma';

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
}
