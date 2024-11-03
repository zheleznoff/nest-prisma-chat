import {
    CanActivate, ExecutionContext, Injectable, UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const { authorization }: any = request.headers;
            if (!authorization || authorization.trim() === '') {
                throw new UnauthorizedException('Please provide token');
            }
            const authToken = authorization.replace(/bearer/gim, '').trim();
            const resp = await this.authService.validateToken(authToken);
            request.decodedData = resp;
            return true;
        } catch (error) {
            console.log('auth error - ', error.message);
            throw new ForbiddenException(error.message || 'session expired! Please sign In');
        }
    }
}

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }
    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const client = context.switchToWs().getClient(); // Получаем клиента (сокет)
        const token = client.handshake?.headers?.authorization?.split(' ')[1]; // Извлекаем токен из заголовка handshake

        if (!token) {
            client.emit('error', { message: 'Invalid token' });
            throw new WsException('Invalid token');
        }

        try {
            // Верифицируем JWT токен
            const decoded = await this.authService.validateToken(token);
            client.user = decoded; // Можно добавить информацию о пользователе в сокет
            return true;
        } catch (err) {
            client.emit('error', { message: 'Invalid token' });
            throw new WsException('Invalid token');
        }
    }
}