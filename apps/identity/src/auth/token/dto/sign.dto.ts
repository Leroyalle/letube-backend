import { EUserRole } from '@contracts/user';

export class SignDto {
  id: string;
  email: string;
  role: EUserRole;
}
