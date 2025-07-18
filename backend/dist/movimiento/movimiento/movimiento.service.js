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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movimiento_entity_1 = require("./movimiento.entity");
const cuenta_entity_1 = require("../../cuentas/entities/cuenta.entity");
let MovimientoService = class MovimientoService {
    movimientoRepository;
    cuentaRepository;
    constructor(movimientoRepository, cuentaRepository) {
        this.movimientoRepository = movimientoRepository;
        this.cuentaRepository = cuentaRepository;
    }
    async createMovimiento(cuentaId, createMovimientoDto) {
        const { amount, type } = createMovimientoDto;
        const cuenta = await this.cuentaRepository.findOne({ where: { id: cuentaId } });
        if (!cuenta) {
            throw new common_1.NotFoundException('Cuenta no encontrada.');
        }
        const newMovimiento = this.movimientoRepository.create({ amount, type, cuenta });
        let updatedAmount = parseFloat(cuenta.saldo.toString());
        const movimientoAmount = parseFloat(amount.toString());
        if (type === 'deposito') {
            updatedAmount += movimientoAmount;
        }
        else if (type === 'retiro') {
            if (updatedAmount < movimientoAmount) {
                throw new common_1.BadRequestException('Saldo insuficiente para el retiro.');
            }
            updatedAmount -= movimientoAmount;
        }
        else {
            throw new common_1.BadRequestException('Tipo de movimiento no válido.');
        }
        await this.cuentaRepository.update(cuenta.id, { saldo: updatedAmount });
        return this.movimientoRepository.save(newMovimiento);
    }
    async findMovimientosByCuentaId(cuentaId) {
        return this.movimientoRepository.find({ where: { cuenta: { id: cuentaId } }, order: { date: 'DESC' } });
    }
};
exports.MovimientoService = MovimientoService;
exports.MovimientoService = MovimientoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movimiento_entity_1.Movimiento)),
    __param(1, (0, typeorm_1.InjectRepository)(cuenta_entity_1.Cuenta)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], MovimientoService);
//# sourceMappingURL=movimiento.service.js.map