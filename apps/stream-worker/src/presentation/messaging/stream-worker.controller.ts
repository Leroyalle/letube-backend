import { STREAM_BROKER_QUEUES } from '@contracts/stream/queues/broker.queues';
import type { ProcessStreamRpcDto } from '@contracts/stream/rpc/process-stream.rpc';

import { Controller } from '@nestjs/common';
import type { EventBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';

import { StartStreamWatchingEvent } from '../../application/events/start-stream-watching.event';

@Controller()
export class StreamWorkerController {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(STREAM_BROKER_QUEUES.published)
  public processStream(@Payload() data: ProcessStreamRpcDto) {
    return this.eventBus.publish(
      new StartStreamWatchingEvent({
        playlistPath: data.playlistPath,
        segmentsPath: data.segmentsPath,
        streamKey: data.streamKey,
      }),
    );
  }
}
