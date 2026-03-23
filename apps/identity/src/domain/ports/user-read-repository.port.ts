import type { UserResponseDto } from '../../application/dto/user-response.dto';

export interface UserReadRepositoryPort {
  findAll(): Promise<UserResponseDto[]>;
}
