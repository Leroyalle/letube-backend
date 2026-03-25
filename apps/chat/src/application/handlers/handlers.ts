import { GetMessagesByReceiverIdHandler } from './get-message-by-receiver-id.handler';
import { MessageCacheHandler } from './message-cache.handler';
import { MessageRealtimeHandler } from './message-realtime.handler';
import { SendMessageHandler } from './send-message.handler';

export const handlers = [
  SendMessageHandler,
  MessageRealtimeHandler,
  MessageCacheHandler,
  GetMessagesByReceiverIdHandler,
];
