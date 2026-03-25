import type { Message } from '../../domain/entities/message.entity';

export interface ChatCacheAdapterPort {
  addMessage(receiverId: string, message: Message): Promise<void>;
  findMessages(receiverId: string): Promise<Message[]>;
}
