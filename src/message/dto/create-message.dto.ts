import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({ description: 'The text of the message', required: true })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ description: 'The id of the author', required: true })
    @IsInt()
    authorId?: number;
}