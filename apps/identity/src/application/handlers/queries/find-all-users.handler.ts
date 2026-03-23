import type { UserReadRepositoryPort } from 'apps/identity/src/domain/ports/user-read-repository.port';

import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { USER_READ_REPOSITORY_TOKEN } from '../../ports/tokens';
import { FindAllUsersQuery } from '../../queries/find-all.query';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery> {
  constructor(
    @Inject(USER_READ_REPOSITORY_TOKEN) private readonly userRepository: UserReadRepositoryPort,
  ) {}

  public execute() {
    return this.userRepository.findAll();
  }
}
