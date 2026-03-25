import type { Message } from '../../domain/entities/message.entity';

export type CachedMessage = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: number;
};

export interface ChatCacheAdapterPort {
  addMessage(receiverId: string, message: Message): Promise<void>;
  findMessages(receiverId: string): Promise<CachedMessage[]>;
}
