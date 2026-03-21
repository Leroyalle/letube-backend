// import { MediaStorageResolver } from '@app/pure/media';
import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

// import { Stream } from '../../domain/entities/stream.entity';
import type { StreamRepositoryPort } from '../../domain/ports/stream-repository.port';
import { PublishStreamCommand } from '../commands/publish-stream.command';
import type { CacheManagerPort } from '../ports/cache-manager.port';
import { CACHE_MANAGER_TOKEN, STREAM_REPOSITORY_TOKEN } from '../ports/tokens';

@CommandHandler(PublishStreamCommand)
export class PublishStreamHandler implements ICommandHandler<PublishStreamCommand> {
  constructor(
    @Inject(STREAM_REPOSITORY_TOKEN) private readonly streamRepository: StreamRepositoryPort,
    @Inject(CACHE_MANAGER_TOKEN) private readonly cacheManager: CacheManagerPort,
  ) {}

  public async execute(command: PublishStreamCommand) {
    const channelId = await this.cacheManager.get(`streamKey:${command.props.streamKey}`);

    if (!channelId) throw new Error('Stream key not found');

    // const playlistPath = MediaStorageResolver.createPlaylistKey(command.props.streamKey, 'video');
    // const segmentsPath = MediaStorageResolver.createHlsFolderKey(command.props.streamKey, 'video');

    // const stream = new Stream({
    //   id: randomUUID(),
    //   channelId,
    //   streamKey: command.props.streamKey,
    //   status: 'PUBLISHED',
    //   playlistPath,
    //   segmentsPath,
    // });

    // await this.streamRepository.create(stream);

    return {
      code: 0,
    };
  }
}
