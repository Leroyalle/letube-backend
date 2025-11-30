import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, EUserRole } from '@contracts';
import { Authorization } from '@app/modules/auth/decorators/authorization.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(EUserRole.ADMIN)
  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // public findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // public findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // public update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // public remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
