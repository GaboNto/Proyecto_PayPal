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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const email_service_1 = require("../email/email.service");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    authService;
    emailService;
    constructor(authService, emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    async register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    async checkRut(rut) {
        return this.authService.checkRutExists(rut);
    }
    async forgotPassword(forgotPasswordDto) {
        await this.emailService.sendPasswordResetEmail(forgotPasswordDto.email, forgotPasswordDto.nombre);
        return { message: 'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.' };
    }
    async sendEmailVerification(forgotPasswordDto) {
        await this.emailService.sendEmailVerification(forgotPasswordDto.email, forgotPasswordDto.nombre);
        return { message: 'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Inicia sesión de un usuario' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string', example: 'usuario@example.com' },
                password: { type: 'string', example: 'password123' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200, description: 'Inicio de sesión exitoso', schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciales inválidas' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registra un nuevo usuario' }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de registro inválidos o RUT/Email ya existente' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('check-rut/:rut'),
    (0, swagger_1.ApiOperation)({ summary: 'Verifica si un RUT ya está registrado' }),
    (0, swagger_1.ApiResponse)({
        status: 200, description: 'Retorna true si el RUT existe, false si no', schema: {
            type: 'object',
            properties: {
                exists: { type: 'boolean', example: true }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Formato de RUT inválido' }),
    __param(0, (0, common_1.Param)('rut')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkRut", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicita un enlace para restablecer la contraseña' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mensaje de éxito (el email se envía si el usuario existe)' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email inválido' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('send-verification-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Envía un email de verificación de cuenta' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mensaje de éxito (el email se envía si el usuario existe)' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email inválido' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendEmailVerification", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, email_service_1.EmailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map