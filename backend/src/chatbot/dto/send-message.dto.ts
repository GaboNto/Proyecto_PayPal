/* eslint-disable prettier/prettier */
// src/chatbot/dto/send-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendMessageDto {
  /**
   * Texto del mensaje que se desea enviar al chatbot.
   * Este campo debe ser una cadena no vacía.
   * 
   * @example "Hola, ¿puedes ayudarme con mi cuenta?"
   */
  @ApiProperty({
    description: 'Texto del mensaje a enviar al chatbot',
    example: 'Hola, ¿puedes ayudarme con mi cuenta?',
  })
  @IsString()
  texto: string;
}
