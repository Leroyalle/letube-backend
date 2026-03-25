import { Server } from 'socket.io';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatEmitter {
  private server: Server | null = null;

  public setServer(server: Server) {
    this.server = server;
  }

  public emitNewMessage(chatId: string, message: any) {
    if (!this.server) throw new Error('No server');
    this.server.to(`chat:${chatId}`).emit('chat:new-message', message);
  }
}
