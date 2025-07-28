/* eslint-disable prettier/prettier */
// src/chatbot/dto/send-message.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class SendMessageDto {
  @ApiProperty({
    description: 'El mensaje de texto que el usuario envía al chatbot.',
    example: '¿Cuál es mi saldo actual?',
    minLength: 1, // Asumiendo que el mensaje no puede estar vacío
  })
  @IsString()
  texto: string;
}
