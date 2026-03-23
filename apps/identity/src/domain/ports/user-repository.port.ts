import type { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  findUserByEmail(email: string): Promise<User | null>;
  create: (data: User) => Promise<User>;
  findById: (id: string) => Promise<User | null>;
  update: (data: User) => Promise<void>;
}
