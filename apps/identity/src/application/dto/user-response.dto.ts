export interface UserResponseDto {
  name: string;
  id: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isVerified: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
