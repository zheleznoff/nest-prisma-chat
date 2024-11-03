import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) { }
  create(createMessageDto: CreateMessageDto) {

    const { text, authorId } = createMessageDto;
    return this.prisma.message.create({
      data: {
        text,
        author: { connect: { id: authorId } }, // Связь с пользователем, если authorId передан
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    },
  );
  }

  findAll() {
    const messages = this.prisma.message.findMany({
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    return messages;
  }

  findOne(id: string) {
    return this.prisma.message.findFirst({ where: { id } }).then(message => {
      if (!message) {
        throw new NotFoundException('Сообщение не найдено!');
      }
      return message;
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
