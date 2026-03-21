import { randomUUID } from 'crypto';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { CreateStreamKeyCommand } from '../commands/create-stream-key.command';
import type { CacheManagerPort } from '../ports/cache-manager.port';
import type { ChannelAdapterPort } from '../ports/channel-adapter.port';
import { CACHE_MANAGER_TOKEN, CHANNEL_ADAPTER_TOKEN } from '../ports/tokens';

@CommandHandler(CreateStreamKeyCommand)
export class CreateStreamKeyHandler implements ICommandHandler<CreateStreamKeyCommand> {
  constructor(
    @Inject(CACHE_MANAGER_TOKEN) private readonly cacheManager: CacheManagerPort,
    @Inject(CHANNEL_ADAPTER_TOKEN) private readonly channelAdapter: ChannelAdapterPort,
  ) {}
  // command: CreateStreamKeyCommand;
  public async execute() {
    // const channel = await this.channelAdapter.findChannelByUserId(command.userId);

    // if (!channel) throw new Error('Channel not found');

    const streamKey = randomUUID();

    await this.cacheManager.add(`streamKey:${streamKey}`, '123', 3600);

    return { streamKey };
  }
}
