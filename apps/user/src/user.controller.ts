import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, USER_PATTERNS } from '@contracts';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.CREATE)
  public create(@Payload() data: CreateUserDto): CreateUserDto {
    return this.userService.create(data);
  }
}
