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
exports.MovimientoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movimiento_entity_1 = require("./movimiento.entity");
const saldo_service_1 = require("../../saldo/saldo/saldo.service");
let MovimientoService = class MovimientoService {
    movimientoRepository;
    saldoService;
    constructor(movimientoRepository, saldoService) {
        this.movimientoRepository = movimientoRepository;
        this.saldoService = saldoService;
    }
    async createMovimiento(saldoId, createMovimientoDto) {
        const { amount, type } = createMovimientoDto;
        const saldo = await this.saldoService.findSaldoById(saldoId);
        if (!saldo) {
            throw new common_1.NotFoundException('Saldo no encontrado.');
        }
        const newMovimiento = this.movimientoRepository.create({ amount, type, saldo });
        let updatedAmount = parseFloat(saldo.amount.toString());
        const movimientoAmount = parseFloat(amount.toString());
        if (type === 'deposito') {
            updatedAmount += movimientoAmount;
        }
        else if (type === 'retiro') {
            if (updatedAmount < movimientoAmount) {
                throw new Error('Saldo insuficiente para el retiro.');
            }
            updatedAmount -= movimientoAmount;
        }
        else if (type === 'transferencia') {
            throw new Error('La lógica de transferencia ');
        }
        else {
            throw new Error('Tipo de movimiento no válido.');
        }
        await this.saldoService.updateSaldo(saldo.id, updatedAmount);
        return this.movimientoRepository.save(newMovimiento);
    }
    async findMovimientosBySaldoId(saldoId) {
        return this.movimientoRepository.find({ where: { saldo: { id: saldoId } }, order: { date: 'DESC' } });
    }
};
exports.MovimientoService = MovimientoService;
exports.MovimientoService = MovimientoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movimiento_entity_1.Movimiento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        saldo_service_1.SaldoService])
], MovimientoService);
//# sourceMappingURL=movimiento.service.js.map