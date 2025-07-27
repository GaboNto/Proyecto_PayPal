/* eslint-disable prettier/prettier */
// src/chatbot/chatbot.controller.ts

import { Controller, Post, Body, UseGuards, Get, Query, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Chatbot')
@ApiBearerAuth()
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) { }

  /**
   * Permite al usuario autenticado enviar una consulta al chatbot.
   * El chatbot responde en base al historial de pagos y cuentas del usuario.
   * 
   * @param req - Solicitud HTTP que contiene el JWT con el ID del usuario.
   * @param body - Objeto con el mensaje del usuario.
   * @returns Respuesta generada por el chatbot como asesor financiero.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Enviar mensaje al chatbot financiero',
    description: 'El usuario envía una pregunta o mensaje y el chatbot responde con base en sus datos financieros.',
  })
  @ApiResponse({
    status: 201,
    description: 'Respuesta generada por el chatbot.',
    schema: {
      example: {
        respuesta: 'Puedes revisar tus pagos recientes en la sección "Historial de movimientos".',
      },
    },
  })
  async responder(@Req() req, @Body() body: SendMessageDto) {
    const userId = req.user.sub;
    const pagos = await this.chatbotService.getPagos(userId);
    const cuentas = await this.chatbotService.obtenerCuentasPorUsuario(userId);
    const cuentasFormateadas = this.chatbotService.formatearCuentas(cuentas);

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
    console.log(respuesta)
    return { respuesta };
  }
}
