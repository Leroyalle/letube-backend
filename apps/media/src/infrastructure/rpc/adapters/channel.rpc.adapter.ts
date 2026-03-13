import {
  CHANNEL_PATTERNS,
  type FindByUserIdDto,
  type FindChannelByUserIdResponse,
} from '@contracts/channel';
import { CHANNEL_SERVICE } from '@infra';
import { lastValueFrom } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

import type { ChannelAdapterPort } from '../../../application/ports/channel.adapter.port';

@Injectable()
export class ChannelRpcAdapter implements ChannelAdapterPort {
  constructor(@Inject(CHANNEL_SERVICE) private readonly channelClient: ClientProxy) {}

  public findChannelByUserId(userId: string): Promise<FindChannelByUserIdResponse | null> {
    const payload: FindByUserIdDto = { userId };
    return lastValueFrom<FindChannelByUserIdResponse | null>(
      this.channelClient.send(CHANNEL_PATTERNS.FIND_BY_USER_ID, payload),
    );
  }
}
