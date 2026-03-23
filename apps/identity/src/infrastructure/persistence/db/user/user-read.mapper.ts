import type { User as PersistenceUser } from 'apps/identity/__generated__/prisma';
import type { UserResponseDto } from 'apps/identity/src/application/dto/user-response.dto';

export class UserReadMapper {
  public static toDto(data: PersistenceUser): UserResponseDto {
    return {
      id: data.id,
      role: data.role,
      updatedAt: data.updatedAt,
      name: data.name,
      isVerified: data.isVerified,
      isBanned: data.isBanned,
      password: data.password,
      email: data.email,
      createdAt: data.createdAt,
    };
  }
}
