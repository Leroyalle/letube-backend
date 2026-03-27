import type { MessageDto } from '@contracts/chat/dto/message.dto';
import type { Server, Socket } from 'socket.io';

import { CommandBus } from '@nestjs/cqrs';
import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { SendMessageCommand } from '../../application/commands/send-message/send-message.command';
import { ChatEmitter } from '../../infrastructure/transport/ws/chat.emitter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
// implements OnGatewayConnection, OnGatewayDisconnect
export class ChatGateway implements OnGatewayInit {
  constructor(
    private readonly chatEmitter: ChatEmitter,
    private readonly commandBus: CommandBus,
  ) {}

  public afterInit(server: Server) {
    return this.chatEmitter.setServer(server);
  }

  public async handleConnection(client: Socket) {
    const { streamId, token } = client.handshake.query;

    const userId = ' sdokfkjsldf';

    if (typeof streamId !== 'string' || typeof token !== 'string') {
      client.disconnect();
      return;
    }

    client.data.streamId = streamId;
    client.data.userId = userId;

    await client.join(`user:${userId}`);
    await client.join(`chat:${streamId}`);
  }

  @SubscribeMessage('send-message')
  public handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDto) {
    return this.commandBus.execute(
      new SendMessageCommand({
        content: payload.content,
        receiverId: payload.receiverId,
        senderId: client.data.userId as string,
      }),
    );
    // return this.chatService.sendMessage(client.data.id as string, payload);
  }
}
