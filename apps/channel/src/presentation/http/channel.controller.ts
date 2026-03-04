import { Controller } from '@nestjs/common';
import { ChannelService } from '../../channel.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CHANNEL_PATTERNS,
  CreateChannelDto,
  FindByIdDto,
  FindByUserIdDto,
} from '@contracts/channel';
import { CommandBus } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../../application/commands/create-channel/create-channel.command';

@Controller()
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern(CHANNEL_PATTERNS.FIND_BY_USER_ID)
  public findByUserId(@Payload() dto: FindByUserIdDto) {
    return this.channelService.findByUserId(dto);
  }

  @MessagePattern(CHANNEL_PATTERNS.FIND_ALL)
  public findAll() {
    return this.channelService.findAll();
  }

  @MessagePattern(CHANNEL_PATTERNS.FIND_BY_ID)
  public findById(@Payload() dto: FindByIdDto) {
    return this.channelService.findById(dto);
  }

  @MessagePattern(CHANNEL_PATTERNS.CREATE)
  public create(@Payload() dto: CreateChannelDto) {
    return this.commandBus.execute(
      new CreateChannelCommand(dto.userId, dto.name, dto.description),
    );
  }
}
