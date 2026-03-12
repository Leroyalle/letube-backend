import {
  CHANNEL_PATTERNS,
  type CreateChannelDto,
  type FindByIdDto,
  type FindByUserIdDto,
} from '@contracts/channel';
import { CHANNEL_SERVICE } from 'libs/infra-constants/src';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChannelService {
  constructor(@Inject(CHANNEL_SERVICE) private readonly channelClient: ClientProxy) {}

  public create(dto: CreateChannelDto) {
    return this.channelClient.emit(CHANNEL_PATTERNS.CREATE, dto);
  }

  public findById(dto: FindByIdDto) {
    return this.channelClient.emit(CHANNEL_PATTERNS.FIND_BY_ID, dto);
  }

  public findByUserId(dto: FindByUserIdDto) {
    return this.channelClient.emit(CHANNEL_PATTERNS.FIND_BY_USER_ID, dto);
  }

  public findAll() {
    return this.channelClient.emit(CHANNEL_PATTERNS.FIND_ALL, undefined);
  }
}
