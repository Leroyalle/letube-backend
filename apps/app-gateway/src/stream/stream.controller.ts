import type { StreamPublishDto } from '@contracts/stream/dto/stream-publish.dto';

import { Body, Controller, Post } from '@nestjs/common';

import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post('publish')
  public streamPublish(@Body() data: StreamPublishDto) {
    return this.streamService.publishStream(data);
  }

  // @Authorization()
  @Post('create-key')
  public createKey() {
    return this.streamService.createKey('123');
  }

  @Post('stop')
  public stop() {
    return this.streamService.stopStream('123');
  }
}
