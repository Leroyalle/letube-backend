import { UserPublicDto } from 'apps/identity/src/application/dto/user-public.dto';
import { User as DomainUser } from 'apps/identity/src/domain/entities/user.entity';

export class UserPublicMapper {
  public static toPublic(data: DomainUser): UserPublicDto {
    return {
      avatar: data.props.avatar || null,
      id: data.props.id,
      name: data.props.name,
    };
  }
}
