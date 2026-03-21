import { MediaStorageResolver } from '@app/pure/media';
import { STREAM_WORKER_BROKER_QUEUES } from '@contracts/stream-worker/queues/broker.queues';
import type { ProcessHlsRpc } from '@contracts/stream-worker/rpc/process-hls.rpc';

import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { PutHlsInQueueCommand } from '../commands/put-hls-in-queue.command';
import type { BrokerEventBusPort } from '../ports/broker-event-bus.port';
import { BROKER_EVENT_BUS_TOKEN } from '../ports/tokens';

@CommandHandler(PutHlsInQueueCommand)
export class PutHlsInQueueHandler implements ICommandHandler<PutHlsInQueueCommand> {
  constructor(
    @Inject(BROKER_EVENT_BUS_TOKEN) private readonly brokerEventBus: BrokerEventBusPort,
  ) {}

  public async execute(command: PutHlsInQueueCommand) {
    const storagePlaylistPath = MediaStorageResolver.createPlaylistKey(
      command.props.streamKey,
      'video',
    );
    const storageSegmentsPath = MediaStorageResolver.createHlsFolderKey(
      command.props.streamKey,
      'video',
    );

    const payload: ProcessHlsRpc = {
      streamKey: command.props.streamKey,
      localPlaylistPath: command.props.localPlaylistPath,
      localSegmentsPath: command.props.localSegmentPath,
      storageSegmentsPath,
      storagePlaylistPath,
    };

    this.brokerEventBus.emit(STREAM_WORKER_BROKER_QUEUES.on_hls, payload);
    return Promise.resolve({
      code: 0,
    });
  }
}
