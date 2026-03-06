import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import type { ChannelRepository } from 'apps/channel/src/domain/interfaces/channel.repository';
import { CreateChannelCommand } from '../commands/create-channel.command';
import { Channel } from 'apps/channel/src/domain/entities/channel.entity';
import { randomUUID } from 'crypto';
import { Inject } from '@nestjs/common';
import { CHANNEL_REPOSITORY } from '../constants/channel-repository.token';

@CommandHandler(CreateChannelCommand)
export class CreateChannelHandler
  implements ICommandHandler<CreateChannelCommand>
{
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelRepository: ChannelRepository,
  ) {}

  public async execute(command: CreateChannelCommand): Promise<Channel> {
    const channel = new Channel(
      randomUUID(),
      command.userId,
      command.name,
      command.description,
    );

    await this.channelRepository.create(channel);

    return channel;
  }
}
