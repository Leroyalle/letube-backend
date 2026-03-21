import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { StartStreamWatchingEvent } from '../events/start-stream-watching.event';
import type { StreamProcessorPort } from '../ports/stream-processor.port';
import { STREAM_PROCESSOR_TOKEN } from '../ports/tokens';

@EventsHandler(StartStreamWatchingEvent)
export class StartStreamWatchingHandler implements IEventHandler<StartStreamWatchingEvent> {
  constructor(
    @Inject(STREAM_PROCESSOR_TOKEN) private readonly streamProcessor: StreamProcessorPort,
  ) {}

  public handle(command: StartStreamWatchingEvent) {
    void this.streamProcessor.process(command.props.streamKey, {
      localPlaylistPath: command.props.localPlaylistPath,
      localSegmentsPath: command.props.localSegmentsPath,
      storageSegmentsPath: command.props.storageSegmentsPath,
      storagePlaylistPath: command.props.storagePlaylistPath,
    });
  }
}
