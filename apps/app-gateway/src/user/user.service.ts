import { CreateUserDto, USER_PATTERNS } from '@contracts/user';
import { IDENTITY_SERVICE } from '@infra';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(@Inject(IDENTITY_SERVICE) private readonly userClient: ClientProxy) {}

  public create(createUserDto: CreateUserDto) {
    return this.userClient.send(USER_PATTERNS.CREATE, createUserDto);
  }
}
