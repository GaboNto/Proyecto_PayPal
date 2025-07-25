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
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getProfile(req) {
        return this.usersService.findById(req.user.sub);
    }
    async getCurrentUser(req) {
        const user = await this.usersService.findById(req.user.sub);
        return {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fecha_nacimiento: user.fecha_nacimiento,
            direccion: user.direccion,
            facturacion: user.facturacion,
            email_verificado: user.email_verificado
        };
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
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('verify-bepass'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verify_bepass_dto_1.VerifyBepassDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "verifyBepass", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('set-bepass'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, set_bepass_dto_1.SetBepassDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "setBepass", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('has-bepass'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "hasBepass", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('2fa/setup'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setup2FA", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/verify'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verify2FA", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map