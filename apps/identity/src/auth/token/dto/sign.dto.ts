import { EUserRole } from '@contracts';

export class SignDto {
  id: string;
  email: string;
  role: EUserRole;
}
