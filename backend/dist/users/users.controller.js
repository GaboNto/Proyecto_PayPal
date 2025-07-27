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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const set_bepass_dto_1 = require("./dto/set-bepass.dto");
const verify_bepass_dto_1 = require("./dto/verify-bepass.dto");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getProfile(req) {
        return this.usersService.findById(req.user.sub);
    }
    verifyBepass(req, verifyBepassDto) {
        const userId = req.user.sub;
        return this.usersService.verifyBepass(userId, verifyBepassDto);
    }
    setBepass(req, setBepassDto) {
        const userId = req.user.sub;
        return this.usersService.setBepass(userId, setBepassDto);
    }
    async hasBepass(req) {
        const user = await this.usersService.findById(req.user.sub);
        return { hasBepass: !!user.bepass };
    }
    async setup2FA(req) {
        const user = await this.usersService.findById(req.user.sub);
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (!user.totpSecret) {
            const secret = speakeasy.generateSecret({ name: `PayPal (${user.email})` });
            user.totpSecret = secret.base32;
            await this.usersService.save(user);
        }
        const otpauth = speakeasy.otpauthURL({
            secret: user.totpSecret,
            label: `PayPal (${user.email})`,
            issuer: 'PayPal',
            encoding: 'base32',
        });
        const qr = await qrcode.toDataURL(otpauth);
        return { secret: user.totpSecret, qr };
    }
    async verify2FA(req, code) {
        const user = await this.usersService.findById(req.user.sub);
        if (!user || !user.totpSecret)
            throw new common_1.UnauthorizedException('2FA no configurado');
        const verified = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: 'base32',
            token: code,
            window: 1
        });
        if (!verified)
            throw new common_1.UnauthorizedException('Código 2FA incorrecto');
        return { success: true };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene el perfil del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil del usuario obtenido exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 1 },
                nombre: { type: 'string', example: 'Juan' },
                apellido: { type: 'string', example: 'Pérez' },
                email: { type: 'string', example: 'juan.perez@example.com' },
                rut: { type: 'string', example: '12345678-9' },
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('verify-bepass'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Verifica la clave BePass del usuario' }),
    (0, swagger_1.ApiBody)({ type: verify_bepass_dto_1.VerifyBepassDto, description: 'Clave BePass a verificar' }),
    (0, swagger_1.ApiResponse)({
        status: 200, description: 'Clave BePass verificada exitosamente', schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado o clave BePass incorrecta' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verify_bepass_dto_1.VerifyBepassDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "verifyBepass", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('set-bepass'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Establece o actualiza la clave BePass del usuario' }),
    (0, swagger_1.ApiBody)({ type: set_bepass_dto_1.SetBepassDto, description: 'Nueva clave BePass y contraseña actual' }),
    (0, swagger_1.ApiResponse)({
        status: 200, description: 'Clave BePass establecida/actualizada exitosamente', schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o contraseña actual incorrecta' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, set_bepass_dto_1.SetBepassDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "setBepass", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('has-bepass'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Verifica si el usuario tiene una clave BePass configurada' }),
    (0, swagger_1.ApiResponse)({
        status: 200, description: 'Estado de BePass del usuario', schema: {
            type: 'object',
            properties: {
                hasBepass: { type: 'boolean', example: true }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "hasBepass", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('2fa/setup'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Inicia la configuración de la autenticación de dos factores (2FA) para el usuario' }),
    (0, swagger_1.ApiResponse)({
        status: 200, description: 'Retorna el secreto TOTP y un código QR para configurar 2FA', schema: {
            type: 'object',
            properties: {
                secret: { type: 'string', example: 'JBSWY3DPEHPK3PXP' },
                qr: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setup2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/verify'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Verifica el código TOTP para la autenticación de dos factores (2FA)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'string', example: '123456', minLength: 6, maxLength: 6 }
            },
            required: ['code']
        },
        description: 'Código TOTP de 6 dígitos generado por la aplicación de autenticación'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200, description: 'Código 2FA verificado exitosamente', schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado o código 2FA incorrecto/no configurado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verify2FA", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map