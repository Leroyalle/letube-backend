import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CHANNEL_PATTERNS,
  CreateChannelDto,
  FindByIdDto,
  FindByUserIdDto,
} from '@contracts/channel';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../../application/commands/create-channel.command';
import { FindByUserIdQuery } from '../../application/queries/find-by-user-id.query';
import { FindAllQuery } from '../../application/queries/find-all.query';
import { FindByIdQuery } from '../../application/queries/find-by-id.query';

@Controller()
export class ChannelController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern(CHANNEL_PATTERNS.FIND_BY_USER_ID)
  public findByUserId(@Payload() dto: FindByUserIdDto) {
    return this.queryBus.execute(new FindByUserIdQuery(dto.userId));
  }

  @MessagePattern(CHANNEL_PATTERNS.FIND_ALL)
  public findAll() {
    return this.queryBus.execute(new FindAllQuery());
  }

  @MessagePattern(CHANNEL_PATTERNS.FIND_BY_ID)
  public findById(@Payload() dto: FindByIdDto) {
    return this.queryBus.execute(new FindByIdQuery(dto.id));
  }

  @MessagePattern(CHANNEL_PATTERNS.CREATE)
  public create(@Payload() dto: CreateChannelDto) {
    return this.commandBus.execute(
      new CreateChannelCommand(dto.userId, dto.name, dto.description),
    );
  }
}
