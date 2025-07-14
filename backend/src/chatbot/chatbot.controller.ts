/* eslint-disable prettier/prettier */
// src/chatbot/chatbot.controller.ts

import { Controller, Post, Body, UseGuards, Get, Query, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async responder(@Req() req, @Body() body: SendMessageDto) {
    const userId = req.user.sub;
    const pagos = await this.chatbotService.getPagos(userId);
    const cuentas = await this.chatbotService.obtenerCuentasPorUsuario(userId);
    const cuentasFormateadas = this.chatbotService.formatearCuentas(cuentas);
    console.log('Pagos del usuario:', pagos, 'cuentas ', cuentasFormateadas);

    const prompt = `
Respuestas claras, concisas y cortas.
Eres un asesor financiero amigable, claro y directo.
Hablas en español, con un tono cercano y educativo.
Evita tecnicismos sin explicar. Si no sabes algo, dilo honestamente.
Historial de pagos del usuario:
${pagos}
Cuentas del usuario:
${cuentasFormateadas}

Usuario: ${body.texto}
Asesor:
`;

    const respuesta = await this.chatbotService.enviarMensaje(prompt);
    return { respuesta };
  }
}
