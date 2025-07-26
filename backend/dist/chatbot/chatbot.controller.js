"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotController = void 0;
const common_1 = require("@nestjs/common");
const chatbot_service_1 = require("./chatbot.service");
const send_message_dto_1 = require("./dto/send-message.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const movimientos_service_1 = require("../movimientos/movimientos.service");
let ChatbotController = class ChatbotController {
    movimientosService;
    chatbotService;
    constructor(movimientosService, chatbotService) {
        this.movimientosService = movimientosService;
        this.chatbotService = chatbotService;
    }
    async responder(req, body) {
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
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "responder", null);
exports.ChatbotController = ChatbotController = __decorate([
    (0, common_1.Controller)('chatbot'),
    __metadata("design:paramtypes", [movimientos_service_1.MovimientosService,
        chatbot_service_1.ChatbotService])
], ChatbotController);
//# sourceMappingURL=chatbot.controller.js.map