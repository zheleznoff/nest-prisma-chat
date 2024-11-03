import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service'; // Сервис для работы с сообщениями
import { WsAuthGuard} from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly messagesService: MessageService) { }

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        // Можете отправить клиенту начальные данные, например, список сообщений
        const messages = await this.messagesService.findAll();
        client.emit('messages', messages);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { text: string, authorId: number }) {
        try {
            const message = await this.messagesService.create(payload);
            this.server.emit('newMessage', message);
            return message;
        } catch (error) {
            console.error('Error while sending message:', error);
            client.emit('error', { message: 'Failed to send message', error: error.message });
        }
    }
}
