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
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const swagger_1 = require("@nestjs/swagger");
const send_password_reset_email_dto_1 = require("./dto/send-password-reset-email.dto");
let EmailController = class EmailController {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    async sendPasswordResetEmail(sendResetDto) {
        await this.emailService.sendPasswordResetEmail(sendResetDto.to);
        return { message: 'Correo de restablecimiento de contraseña enviado exitosamente.' };
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)('send-password-reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Envía un correo de restablecimiento de contraseña con un enlace proporcionado.' }),
    (0, swagger_1.ApiBody)({ type: send_password_reset_email_dto_1.SendPasswordResetEmailDto, description: 'Datos del destinatario y el enlace de restablecimiento. Este endpoint es para uso interno o administrativo, ya que el enlace debe ser generado por el servidor.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Correo de restablecimiento de contraseña enviado exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de la solicitud inválidos (ej. email o enlace no válidos).' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Error interno del servidor al enviar el correo.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_password_reset_email_dto_1.SendPasswordResetEmailDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendPasswordResetEmail", null);
exports.EmailController = EmailController = __decorate([
    (0, swagger_1.ApiTags)('Email'),
    (0, common_1.Controller)('email'),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], EmailController);
//# sourceMappingURL=email.controller.js.map