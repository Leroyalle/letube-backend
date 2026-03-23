import type { SendMessageDto } from '@contracts/notification';

export interface MailerAdapterPort {
  sendMessage(dto: SendMessageDto): Promise<void>;
}
