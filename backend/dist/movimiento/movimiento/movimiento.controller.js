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
exports.MovimientoController = void 0;
const common_1 = require("@nestjs/common");
const movimiento_service_1 = require("./movimiento.service");
const create_movimiento_dto_1 = require("./dto/create-movimiento.dto");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let MovimientoController = class MovimientoController {
    movimientoService;
    constructor(movimientoService) {
        this.movimientoService = movimientoService;
    }
    async createMovimiento(cuentaId, createMovimientoDto) {
        const movimiento = await this.movimientoService.createMovimiento(cuentaId, createMovimientoDto);
        return movimiento;
    }
    async getMovimientosByCuentaId(cuentaId) {
        const movimientos = await this.movimientoService.findMovimientosByCuentaId(cuentaId);
        return movimientos;
    }
};
exports.MovimientoController = MovimientoController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':cuentaId/movimientos'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un nuevo movimiento para una cuenta específica' }),
    (0, swagger_1.ApiParam)({
        name: 'cuentaId',
        description: 'ID de la cuenta a la que se asociará el movimiento',
        type: 'integer',
        example: 1
    }),
    (0, swagger_1.ApiBody)({ type: create_movimiento_dto_1.CreateMovimientoDto, description: 'Datos del nuevo movimiento' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Movimiento creado exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 1 },
                tipo: { type: 'string', example: 'INGRESO' },
                monto: { type: 'number', example: 10000.00 },
                descripcion: { type: 'string', example: 'Depósito de salario' },
                fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:00:00Z' },
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de movimiento inválidos o cuenta no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cuenta no encontrada' }),
    __param(0, (0, common_1.Param)('cuentaId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_movimiento_dto_1.CreateMovimientoDto]),
    __metadata("design:returntype", Promise)
], MovimientoController.prototype, "createMovimiento", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':cuentaId/movimientos'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los movimientos de una cuenta específica' }),
    (0, swagger_1.ApiParam)({
        name: 'cuentaId',
        description: 'ID de la cuenta de la cual se obtendrán los movimientos',
        type: 'integer',
        example: 1
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de movimientos de la cuenta',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    tipo: { type: 'string', example: 'GASTO' },
                    monto: { type: 'number', example: 500.00 },
                    descripcion: { type: 'string', example: 'Compra en supermercado' },
                    fecha: { type: 'string', format: 'date-time', example: '2025-07-26T15:30:00Z' },
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cuenta no encontrada' }),
    __param(0, (0, common_1.Param)('cuentaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovimientoController.prototype, "getMovimientosByCuentaId", null);
exports.MovimientoController = MovimientoController = __decorate([
    (0, swagger_1.ApiTags)('Movimientos'),
    (0, common_1.Controller)('cuentas'),
    __metadata("design:paramtypes", [movimiento_service_1.MovimientoService])
], MovimientoController);
//# sourceMappingURL=movimiento.controller.js.map