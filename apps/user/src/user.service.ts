import { CreateUserDto } from '@contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  public create(data: CreateUserDto): CreateUserDto {
    return data;
  }
}
