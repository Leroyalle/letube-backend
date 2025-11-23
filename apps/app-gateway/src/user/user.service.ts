import { Inject, Injectable } from '@nestjs/common';
import { USER_SERVICE } from '@infra';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, USER_PATTERNS } from '@contracts';

@Injectable()
export class UserService {
  constructor(@Inject(USER_SERVICE) private readonly userClient: ClientProxy) {}

  public create(createUserDto: CreateUserDto) {
    return this.userClient.send(USER_PATTERNS.CREATE, createUserDto);
  }

  // public findAll() {
  //   return `This action returns all user`;
  // }

  // public findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // public update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // public remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
