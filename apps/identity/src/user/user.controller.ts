import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, USER_PATTERNS } from '@contracts/user';
import { User } from 'apps/identity/__generated__/prisma';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.CREATE)
  public async create(
    @Payload() data: CreateUserDto,
  ): Promise<User | undefined> {
    return await this.userService.create(data);
  }
}
