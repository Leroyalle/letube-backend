import type { StreamPublishDto } from '@contracts/stream/dto/stream-publish.dto';
import { STREAM_PATTERNS } from '@contracts/stream/patterns/patterns';
import type { StreamPublishRpc } from '@contracts/stream/rpc/stream-publish.rpc';
import { STREAM_SERVICE } from '@infra';

import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class StreamService {
  constructor(@Inject(STREAM_SERVICE) private readonly streamClient: ClientProxy) {}

  public publishStream(data: StreamPublishDto) {
    const payload: StreamPublishRpc = {
      streamKey: data.stream,
      userId: '123',
    };
    return this.streamClient.send(STREAM_PATTERNS.PUBLISH, payload);
  }

  public createKey(userId: string) {
    return this.streamClient.send(STREAM_PATTERNS.CREATE_STREAM_KEY, { userId });
  }

  public stopStream(streamKey: string) {
    return this.streamClient.send(STREAM_PATTERNS.STOP, { streamKey });
  }
}
