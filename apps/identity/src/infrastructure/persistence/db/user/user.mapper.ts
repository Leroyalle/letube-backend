import type { User as PersistenceUser } from 'apps/identity/__generated__/prisma';
import { User as DomainUser } from 'apps/identity/src/domain/entities/user.entity';

export class UserMapper {
  public static toDomain(data: PersistenceUser): DomainUser {
    return DomainUser.create({
      id: data.id,
      email: data.email,
      name: data.name,
      password: data.password,
      isBanned: data.isBanned,
      isVerified: data.isVerified,
      role: data.role,
      avatar: data.avatar,
    });
  }

  public static toPersistence(data: DomainUser): PersistenceUser {
    return {
      avatar: data.props.avatar || null,
      email: data.props.email,
      id: data.props.id,
      name: data.props.name,
      password: data.props.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      isBanned: false,
      isVerified: false,
      role: 'USER',
    };
  }
}
