import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../../../libs/contracts/src/user/dto/create-user.dto';
import { IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID(undefined, { message: 'Invalid id' })
  id: string;
}
