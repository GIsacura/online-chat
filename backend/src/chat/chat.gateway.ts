import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  public server: Server;

  onModuleInit() {
    //Listen new connections
    this.server.on('connection', (socket) => {
      const { name } = socket.handshake.auth;

      if (!name) {
        socket.disconnect();
        return;
      }

      //Join the user to the chat room
      this.chatService.onClientConnected({ id: socket.id, name });

      //List of connected clients
      this.server.emit('on-clients-changed', this.chatService.getClients());

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('on-clients-changed', this.chatService.getClients());
      });
    });
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { name } = client.handshake.auth;
    if (!message) return;

    this.server.emit('on-message', {
      userId: client.id,
      name,
      message,
    });
  }
}
