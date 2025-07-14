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
let ChatbotController = class ChatbotController {
    chatbotService;
    constructor(chatbotService) {
        this.chatbotService = chatbotService;
    }
    async responder(req, body) {
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
    __metadata("design:paramtypes", [chatbot_service_1.ChatbotService])
], ChatbotController);
//# sourceMappingURL=chatbot.controller.js.map