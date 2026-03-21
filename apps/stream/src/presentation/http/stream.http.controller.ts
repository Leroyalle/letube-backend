import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { PutHlsInQueueCommand } from '../../application/commands/put-hls-in-queue.command';
import type { SrsOnHlsEvent } from '../dto/src-on-hls-event.dto';

@Controller('stream')
export class StreamHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('hls')
  public putHlsInQueue(@Body() data: SrsOnHlsEvent) {
    return this.commandBus.execute(
      new PutHlsInQueueCommand({
        localPlaylistPath: data.m3u8_url,
        localSegmentPath: data.url,
        streamKey: data.stream,
      }),
    );
  }
}
