import { STREAM_PATTERNS } from '@contracts/stream/patterns/patterns';
import type { CreateStreamKeyRpc } from '@contracts/stream/rpc/create-stream-key.rpc';
import type { StreamPublishRpc } from '@contracts/stream/rpc/stream-publish.rpc';

import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateStreamKeyCommand } from '../../application/commands/create-stream-key.command';
import { PublishStreamCommand } from '../../application/commands/publish-stream.command';

@Controller()
export class StreamController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern(STREAM_PATTERNS.PUBLISH)
  public streamPublished(@Payload() data: StreamPublishRpc) {
    return this.commandBus.execute(
      new PublishStreamCommand({
        streamKey: data.streamKey,
      }),
    );
  }

  @MessagePattern(STREAM_PATTERNS.CREATE_STREAM_KEY)
  public createStreamKey(@Payload() data: CreateStreamKeyRpc) {
    return this.commandBus.execute(new CreateStreamKeyCommand(data.userId));
  }
}
