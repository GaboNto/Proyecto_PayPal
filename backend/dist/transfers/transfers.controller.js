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
exports.TransfersController = void 0;
const common_1 = require("@nestjs/common");
const transfers_service_1 = require("./transfers.service");
const create_transfer_dto_1 = require("./dto/create-transfer.dto");
const create_internal_transfer_dto_1 = require("./dto/create-internal-transfer.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let TransfersController = class TransfersController {
    transfersService;
    constructor(transfersService) {
        this.transfersService = transfersService;
    }
    transferBetweenOwnAccounts(createInternalTransferDto, req) {
        const userId = req.user.sub;
        return this.transfersService.transferBetweenOwnAccounts(createInternalTransferDto, userId);
    }
    create(createTransferDto, req) {
        const usuarioOrigenId = req.user.sub;
        return this.transfersService.create(createTransferDto, usuarioOrigenId);
    }
    async getHistory(req, from, to) {
        const userId = req.user.sub;
        return this.transfersService.getUserHistory(userId, from, to);
    }
    async obtenerHistorialUsuario(req) {
        const userId = req.user.sub;
        return this.transfersService.obtenerHistorialPorUsuario(userId);
    }
    async obtenerTipoYSaldo(numeroCuenta) {
        const resultado = await this.transfersService.obtenerTipoYSaldoPorNumeroCuenta(numeroCuenta);
        if (!resultado.tipoCuenta && resultado.saldo === null) {
            throw new common_1.NotFoundException('Cuenta no encontrada');
        }
        console.log(resultado);
        return resultado;
    }
};
exports.TransfersController = TransfersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('between-accounts'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Realiza una transferencia entre cuentas propias del usuario autenticado' }),
    (0, swagger_1.ApiBody)({ type: create_internal_transfer_dto_1.CreateInternalTransferDto, description: 'Datos para la transferencia entre cuentas propias' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transferencia interna realizada exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 1 },
                monto: { type: 'number', example: 50000.00 },
                cuentaOrigen: { type: 'string', example: 'CL1234567890' },
                cuentaDestino: { type: 'string', example: 'CL0987654321' },
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de transferencia inválidos, fondos insuficientes o cuentas no encontradas' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acceso prohibido (las cuentas no pertenecen al usuario)' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_internal_transfer_dto_1.CreateInternalTransferDto, Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "transferBetweenOwnAccounts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea una transferencia a un destinatario externo' }),
    (0, swagger_1.ApiBody)({ type: create_transfer_dto_1.CreateTransferDto, description: 'Datos para la transferencia a un destinatario externo' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transferencia externa realizada exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 2 },
                monto: { type: 'number', example: 100000.00 },
                cuentaOrigen: { type: 'string', example: 'CL1234567890' },
                destinatario: { type: 'string', example: 'Juan Pérez' },
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de transferencia inválidos, fondos insuficientes o destinatario no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cuenta de origen o destinatario no encontrado' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transfer_dto_1.CreateTransferDto, Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene el historial de transferencias del usuario autenticado con filtros opcionales de fecha' }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: 'string', format: 'date', description: 'Fecha de inicio para filtrar (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: 'string', format: 'date', description: 'Fecha de fin para filtrar (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Historial de transferencias del usuario',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    monto: { type: 'number', example: 50000.00 },
                    fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:00:00Z' },
                    tipo: { type: 'string', example: 'transferencia_enviada' },
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "getHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('historial'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene el historial simplificado de transferencias del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Historial simplificado de transferencias del usuario',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    monto: { type: 'number', example: 50000.00 },
                    fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:00:00Z' },
                    tipo: { type: 'string', example: 'transferencia_enviada' },
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "obtenerHistorialUsuario", null);
__decorate([
    (0, common_1.Get)('cuenta-info/:numeroCuenta'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene el tipo y saldo de una cuenta por su número de cuenta' }),
    (0, swagger_1.ApiParam)({
        name: 'numeroCuenta',
        description: 'Número de cuenta para obtener información',
        type: 'string',
        example: 'CL1234567890'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tipo de cuenta y saldo encontrados',
        schema: {
            type: 'object',
            properties: {
                tipoCuenta: { type: 'string', example: 'Cuenta Corriente' },
                saldo: { type: 'number', example: 1500000.00 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cuenta no encontrada' }),
    __param(0, (0, common_1.Param)('numeroCuenta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransfersController.prototype, "obtenerTipoYSaldo", null);
exports.TransfersController = TransfersController = __decorate([
    (0, swagger_1.ApiTags)('Transfers'),
    (0, common_1.Controller)('transfers'),
    __metadata("design:paramtypes", [transfers_service_1.TransfersService])
], TransfersController);
//# sourceMappingURL=transfers.controller.js.map