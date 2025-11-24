import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, USER_PATTERNS } from '@contracts';
import { User } from '@prisma/client';

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
