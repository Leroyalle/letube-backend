import { EUserRole } from '../enums';

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: EUserRole;
}
