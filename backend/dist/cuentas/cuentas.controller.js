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
exports.CuentasController = void 0;
const common_1 = require("@nestjs/common");
const cuentas_service_1 = require("./cuentas.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let CuentasController = class CuentasController {
    cuentasService;
    constructor(cuentasService) {
        this.cuentasService = cuentasService;
    }
    findUserAccounts(req) {
        return this.cuentasService.findByUserId(req.user.sub);
    }
    async createAccount(req, body) {
        return this.cuentasService.create(req.user.sub, body.tipo_cuenta);
    }
};
exports.CuentasController = CuentasController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todas las cuentas bancarias del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de cuentas del usuario',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    numero_cuenta: { type: 'string', example: 'CL1234567890' },
                    tipo_cuenta: { type: 'string', example: 'Cuenta Corriente' },
                    saldo: { type: 'number', format: 'float', example: 1500000.00 },
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado o sin cuentas' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CuentasController.prototype, "findUserAccounts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea una nueva cuenta bancaria para el usuario autenticado' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                tipo_cuenta: {
                    type: 'string',
                    example: 'Cuenta de Ahorro',
                    enum: ['Cuenta Corriente', 'Cuenta de Ahorro', 'Cuenta Vista']
                },
            },
            required: ['tipo_cuenta']
        },
        description: 'Tipo de cuenta a crear (ej. "Cuenta Corriente", "Cuenta de Ahorro", "Cuenta Vista").'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Cuenta creada exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                numero_cuenta: { type: 'string', example: 'CL9876543210' },
                tipo_cuenta: { type: 'string', example: 'Cuenta de Ahorro' },
                saldo: { type: 'number', format: 'float', example: 0.00 },
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Tipo de cuenta inválido o ya existe una cuenta de ese tipo' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CuentasController.prototype, "createAccount", null);
exports.CuentasController = CuentasController = __decorate([
    (0, swagger_1.ApiTags)('Cuentas'),
    (0, common_1.Controller)('cuentas'),
    __metadata("design:paramtypes", [cuentas_service_1.CuentasService])
], CuentasController);
//# sourceMappingURL=cuentas.controller.js.map