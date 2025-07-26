/* eslint-disable prettier/prettier */
// src/chatbot/chatbot.controller.ts

import { Controller, Post, Body, UseGuards, Get, Query, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MovimientosService } from 'src/movimientos/movimientos.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly movimientosService: MovimientosService,
    private readonly chatbotService: ChatbotService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async responder(@Req() req, @Body() body: SendMessageDto) {
    const userId = req.user.sub;
    const cuentas = await this.chatbotService.obtenerCuentasPorUsuario(userId);
    const movimientos = await this.movimientosService.obtenerMovimientosPorUsuario(userId);
    const cuentasFormateadas = this.chatbotService.formatearCuentas(cuentas);
    const movimientosParaIA = JSON.stringify(movimientos, null, 2);

    const prompt = `
Eres un Asesor Financiero Virtual de PayPal.
Tu objetivo es ayudar al usuario a entender y gestionar sus finanzas dentro de la plataforma.

**Directrices para tus respuestas:**
-   **Tono:** Amigable, cercano, profesional y educativo.
-   **Idioma:** Español de Chile.
-   **Claridad:** Respuestas claras, directas, concisas y fáciles de entender. Evita la jerga financiera a menos que la expliques.
-   **Confianza:** Si no tienes la información o la capacidad para responder, dilo honestamente y sugiere cómo el usuario puede obtener ayuda (ej. "Para eso, te recomiendo contactar a soporte técnico").
-   **Formato:** Utiliza viñetas o listas cuando sea apropiado para mejorar la legibilidad.
-   **Contexto:** Siempre basa tus respuestas en la información proporcionada sobre las cuentas y movimientos del usuario. No inventes datos.

**Información actual del usuario (ACTUALIZA ESTO DINÁMICAMENTE):**
---INICIO DE DATOS---
[Cuentas del Usuario]:
${cuentasFormateadas}

[Historial de Movimientos Detallado (pagos y transferencias)]:
${movimientosParaIA}
---FIN DE DATOS---

**Historial de Conversación (si aplica):**
**Pregunta del Usuario:**
${body.texto}

**Tu Respuesta:**
`;

    const respuesta = await this.chatbotService.enviarMensaje(prompt);
    return { respuesta };
  }
}