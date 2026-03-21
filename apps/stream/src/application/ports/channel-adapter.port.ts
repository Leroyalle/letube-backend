import type { FindChannelByUserIdResponse } from '@contracts/channel';

export interface ChannelAdapterPort {
  findChannelByUserId(userId: string): Promise<FindChannelByUserIdResponse | null>;
}
