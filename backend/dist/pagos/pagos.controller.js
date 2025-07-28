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
exports.PagosController = void 0;
const common_1 = require("@nestjs/common");
const pagos_service_1 = require("./pagos.service");
const create_pago_dto_1 = require("./dto/create-pago.dto");
const create_credit_card_payment_dto_1 = require("./dto/create-credit-card-payment.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let PagosController = class PagosController {
    pagosService;
    constructor(pagosService) {
        this.pagosService = pagosService;
    }
    async create(createPagoDto) {
        return await this.pagosService.create(createPagoDto);
    }
    async createCreditCardPayment(req, createCreditCardPaymentDto) {
        const result = await this.pagosService.createCreditCardPayment(createCreditCardPaymentDto);
        return result;
    }
};
exports.PagosController = PagosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un nuevo pago general' }),
    (0, swagger_1.ApiBody)({ type: create_pago_dto_1.CreatePagoDto, description: 'Datos para crear un pago' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Pago creado exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 1 },
                monto: { type: 'number', example: 100.00 },
                descripcion: { type: 'string', example: 'Pago de servicio' },
                fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:00:00Z' },
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de pago inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pago_dto_1.CreatePagoDto]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('debit-card'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un nuevo pago utilizando una tarjeta de crédito/débito' }),
    (0, swagger_1.ApiBody)({ type: create_credit_card_payment_dto_1.CreateCreditCardPaymentDto, description: 'Datos del pago con tarjeta de crédito/débito' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Pago con tarjeta creado exitosamente',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 2 },
                monto: { type: 'number', example: 50.00 },
                descripcion: { type: 'string', example: 'Compra online' },
                fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:05:00Z' },
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de pago o tarjeta inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cuenta o tarjeta no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 402, description: 'Fondos insuficientes (si aplica)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_credit_card_payment_dto_1.CreateCreditCardPaymentDto]),
    __metadata("design:returntype", Promise)
], PagosController.prototype, "createCreditCardPayment", null);
exports.PagosController = PagosController = __decorate([
    (0, swagger_1.ApiTags)('Pagos'),
    (0, common_1.Controller)('pagos'),
    __metadata("design:paramtypes", [pagos_service_1.PagosService])
], PagosController);
//# sourceMappingURL=pagos.controller.js.map