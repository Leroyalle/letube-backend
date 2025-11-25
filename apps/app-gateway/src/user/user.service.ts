import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, USER_PATTERNS } from '@contracts';
import { IDENTITY_SERVICE } from '@infra';

@Injectable()
export class UserService {
  constructor(
    @Inject(IDENTITY_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  public create(createUserDto: CreateUserDto) {
    return this.userClient.send(USER_PATTERNS.CREATE, createUserDto);
  }
}
