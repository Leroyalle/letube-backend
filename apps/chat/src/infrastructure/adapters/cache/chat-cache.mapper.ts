import { Message } from 'apps/chat/src/domain/entities/message.entity';

type CachedMessage = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: number;
};

export class MessageCacheMapper {
  public static toCache(message: Message): CachedMessage {
    const dto = message.snapshot();

    return {
      id: dto.id,
      content: dto.content,
      receiverId: dto.receiverId,
      senderId: dto.senderId,
      createdAt: dto.createdAt.getTime(),
    };
  }

  public static fromCache(raw: string): Message {
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Invalid JSON in cache');
    }

    if (!isCachedMessage(parsed)) {
      throw new Error('Invalid cached message');
    }

    return Message.rehydrate({
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    });
  }
}

function isCachedMessage(parsed: any): parsed is CachedMessage {
  return (
    // parsed.v === 1 &&
    typeof parsed.id === 'string' &&
    typeof parsed.content === 'string' &&
    typeof parsed.senderId === 'string' &&
    typeof parsed.receiverId === 'string' &&
    typeof parsed.createdAt === 'number'
  );
}
