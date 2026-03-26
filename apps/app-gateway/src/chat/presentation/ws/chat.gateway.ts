import type { MessageDto } from '@contracts/chat/dto/message.dto';
import type { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { ChatClientService } from '../../application/use-cases/chat-client.service';
import { ChatEmitter } from '../../infrastructure/transport/ws/chat.emitter';

@WebSocketGateway()
// implements OnGatewayConnection, OnGatewayDisconnect
export class ChatGateway implements OnGatewayInit {
  constructor(
    private readonly chatService: ChatClientService,
    private readonly chatEmitter: ChatEmitter,
  ) {}

  public afterInit(server: Server) {
    return this.chatEmitter.setServer(server);
  }

  // public handleConnection(client: Socket) {
  //   return this.chatService.handleConnection(client);
  // }

  // public handleDisconnect(client: Socket) {}

  @SubscribeMessage('send-message')
  public handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: MessageDto) {
    return this.chatService.sendMessage(client.data.id as string, payload);
  }
}
