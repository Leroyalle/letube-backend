import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, EUserRole } from '@contracts/user';
import { Authorization } from '@app/modules/auth/decorators/authorization.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(EUserRole.ADMIN)
  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
