import { UserPublicDto } from 'apps/identity/src/application/dto/user-public.dto';

export class SuccessLoginDto {
  accessData!: TokenData;
  refreshData!: TokenData;
  user!: UserPublicDto;
}

export class TokenData {
  token!: string;
  expiresAt!: ExpiresData;
}

export class ExpiresData {
  expiresMs!: number;
  expiresDate!: Date;
}
