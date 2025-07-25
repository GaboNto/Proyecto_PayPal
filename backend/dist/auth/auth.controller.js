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
let AuthController = class AuthController {
    authService;
    async verifyEmail(token, res) {
        try {
            console.log('Token recibido:', token);
            if (!token) {
                throw new common_1.BadRequestException('Token no proporcionado');
            }
            const result = await this.authService.verifyEmail(token);
            const htmlResponse = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${result.message === '¡Correo verificado correctamente!' ? 'Verificación Exitosa' : 'Error de Verificación'}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f5f5f5;
              }
              .container {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 90%;
              }
              .icon {
                font-size: 48px;
                margin-bottom: 1rem;
              }
              .success {
                color: #00a65a;
              }
              .error {
                color: #dc3545;
              }
              .message {
                margin: 1rem 0;
                color: #333;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #0070ba;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 1rem;
                transition: background-color 0.3s;
              }
              .button:hover {
                background-color: #005ea6;
              }
              .logo {
                max-width: 100px;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal Logo" class="logo">
              ${result.message === '¡Correo verificado correctamente!'
                ? `<div class="icon success">✓</div>
                   <h1>¡Email Verificado!</h1>
                   <p class="message">Tu correo electrónico ha sido verificado correctamente.</p>`
                : `<div class="icon error">✕</div>
                   <h1>Error de Verificación</h1>
                   <p class="message">${result.message}</p>`}
              <a href="/login" class="button">Ir al inicio de sesión</a>
            </div>
            <script>
              // Redirigir después de 5 segundos
              setTimeout(() => {
                window.location.href = '/login';
              }, 5000);
            </script>
          </body>
        </html>
      `;
            return res.send(htmlResponse);
        }
        catch (error) {
            console.error('Error en la verificación:', error);
            return res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error Inesperado</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f5f5f5;
              }
              .container {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 90%;
              }
              .icon {
                font-size: 48px;
                margin-bottom: 1rem;
                color: #dc3545;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #0070ba;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">✕</div>
              <h1>Error Inesperado</h1>
              <p>Ha ocurrido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.</p>
              <a href="/login" class="button">Volver al inicio</a>
            </div>
          </body>
        </html>
      `);
        }
    }
    constructor(authService) {
        this.authService = authService;
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
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async sendVerificationEmail(email) {
        return this.authService.sendVerificationEmail(email);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('verify-email/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('check-rut/:rut'),
    __param(0, (0, common_1.Param)('rut')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkRut", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('send-verification-email'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendVerificationEmail", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map