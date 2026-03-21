import { STREAM_WORKER_BROKER_QUEUES } from '@contracts/stream-worker/queues/broker.queues';
import type { ProcessHlsRpc } from '@contracts/stream-worker/rpc/process-hls.rpc';

import { Controller } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';

import { StartStreamWatchingEvent } from '../../application/events/start-stream-watching.event';

@Controller()
export class StreamWorkerEventsController {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(STREAM_WORKER_BROKER_QUEUES.on_hls)
  public onHls(@Payload() data: ProcessHlsRpc) {
    console.log('worker on hls data', data);
    return this.eventBus.publish(
      new StartStreamWatchingEvent({
        localPlaylistPath: data.localPlaylistPath,
        localSegmentsPath: data.localSegmentsPath,
        streamKey: data.streamKey,
        storagePlaylistPath: data.storagePlaylistPath,
        storageSegmentsPath: data.storageSegmentsPath,
      }),
    );
  }
}
