/* eslint-disable prettier/prettier */
// src/chatbot/chatbot.module.ts
import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from 'src/pagos/entities/pago.entity';
import { User } from 'src/users/user.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, User, Cuenta])
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule { }
