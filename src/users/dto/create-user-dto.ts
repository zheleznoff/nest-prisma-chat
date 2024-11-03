import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'The username', required: true })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ description: 'hashed password', required: true })
    @IsInt()
    password: string;
}