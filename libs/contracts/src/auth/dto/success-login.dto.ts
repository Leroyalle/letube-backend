export class SuccessLoginDto {
  accessData: TokenData;
  refreshData: TokenData;
}

export class TokenData {
  token: string;
  expiresAt: ExpiresData;
}

export class ExpiresData {
  expiresMs: number;
  expiresDate: Date;
}
