import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MessagesGateway } from './message.gateway'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MessageController],
  providers: [MessageService, MessagesGateway],
})
export class MessageModule {}
