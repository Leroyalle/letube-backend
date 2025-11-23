import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../../../libs/contracts/src/user/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
