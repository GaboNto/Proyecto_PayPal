/* eslint-disable prettier/prettier */
// src/chatbot/chatbot.controller.ts

import { Controller, Post, Body, UseGuards, Get, Query, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MovimientosService } from 'src/movimientos/movimientos.service';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Chatbot') // Agrupa todas las rutas de este controlador bajo la etiqueta "Chatbot" en Swagger UI
@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly movimientosService: MovimientosService,
    private readonly chatbotService: ChatbotService
  ) { }

  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  @Post()
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Envía un mensaje al chatbot y recibe una respuesta' }) // Descripción de la operación
  @ApiBody({ type: SendMessageDto }) // Especifica el DTO para el cuerpo de la solicitud
  @ApiResponse({
    status: 200,
    description: 'Respuesta exitosa del chatbot',
    schema: {
      type: 'object',
      properties: {
        respuesta: { type: 'string', example: 'Hola, ¿en qué puedo ayudarte hoy con tus finanzas?' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor al comunicarse con el modelo de IA' })
  async responder(@Req() req, @Body() body: SendMessageDto) {
    const userId = req.user.sub; // Obtiene el ID del usuario autenticado
    const cuentas = await this.chatbotService.obtenerCuentasPorUsuario(userId); // Obtiene las cuentas del usuario
    const movimientos = await this.movimientosService.obtenerMovimientosPorUsuario(userId); // Obtiene los movimientos del usuario

    // Formatea las cuentas y movimientos para ser enviados al modelo de IA como contexto
    const cuentasFormateadas = this.chatbotService.formatearCuentas(cuentas);
    const movimientosParaIA = JSON.stringify(movimientos, null, 2);

    // Construye el prompt para el modelo de IA con las directrices y el contexto del usuario
    const prompt = `
Eres un Asesor Financiero Virtual de PayPal.
Tu objetivo es ayudar al usuario a entender y gestionar sus finanzas dentro de la plataforma.

**Directrices para tus respuestas:**
-   **Tono:** Amigable, cercano, profesional y educativo.
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

    // Envía el prompt al servicio del chatbot para obtener una respuesta del modelo de IA
    const respuesta = await this.chatbotService.enviarMensaje(prompt);
    // Retorna la respuesta del chatbot
    return { respuesta };
  }
}
