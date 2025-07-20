/* eslint-disable prettier/prettier */
// src/chatbot/dto/send-message.dto.ts
import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  texto: string;
}
