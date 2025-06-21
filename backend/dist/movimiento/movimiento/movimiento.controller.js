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
let MovimientoController = class MovimientoController {
    movimientoService;
    constructor(movimientoService) {
        this.movimientoService = movimientoService;
    }
    async createMovimiento(saldoId, createMovimientoDto) {
        const movimiento = await this.movimientoService.createMovimiento(saldoId, createMovimientoDto);
        return movimiento;
    }
    async getMovimientosBySaldoId(saldoId) {
        const movimientos = await this.movimientoService.findMovimientosBySaldoId(saldoId);
        return movimientos;
    }
};
exports.MovimientoController = MovimientoController;
__decorate([
    (0, common_1.Post)(':saldoId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
    __param(0, (0, common_1.Param)('saldoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_movimiento_dto_1.CreateMovimientoDto]),
    __metadata("design:returntype", Promise)
], MovimientoController.prototype, "createMovimiento", null);
__decorate([
    (0, common_1.Get)('saldo/:saldoId'),
    __param(0, (0, common_1.Param)('saldoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovimientoController.prototype, "getMovimientosBySaldoId", null);
exports.MovimientoController = MovimientoController = __decorate([
    (0, common_1.Controller)('movimientos'),
    __metadata("design:paramtypes", [movimiento_service_1.MovimientoService])
], MovimientoController);
//# sourceMappingURL=movimiento.controller.js.map