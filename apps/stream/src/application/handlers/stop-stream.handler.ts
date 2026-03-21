import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import type { StreamRepositoryPort } from '../../domain/ports/stream-repository.port';
import { StopStreamCommand } from '../commands/stop-stream.command';
import { STREAM_REPOSITORY_TOKEN } from '../ports/tokens';

@CommandHandler(StopStreamCommand)
export class StopStreamHandler implements ICommandHandler<StopStreamCommand> {
  constructor(
    @Inject(STREAM_REPOSITORY_TOKEN) private readonly streamRepository: StreamRepositoryPort,
  ) {}

  public async execute(command: StopStreamCommand) {
    const stream = await this.streamRepository.findByStreamKey(command.streamKey);

    if (!stream) throw new Error('Stream not found');

    stream.changeStatus('STOPPED');

    return await this.streamRepository.update(stream);
  }
}
