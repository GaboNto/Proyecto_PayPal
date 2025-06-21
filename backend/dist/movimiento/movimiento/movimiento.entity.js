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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movimiento = void 0;
const typeorm_1 = require("typeorm");
const saldo_entity_1 = require("../../saldo/saldo/saldo.entity");
const card_entity_1 = require("../../card/card.entity");
let Movimiento = class Movimiento {
    id;
    amount;
    type;
    date;
    saldo;
    card;
};
exports.Movimiento = Movimiento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Movimiento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Movimiento.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Movimiento.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Movimiento.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => saldo_entity_1.Saldo, saldo => saldo.movimientos),
    __metadata("design:type", saldo_entity_1.Saldo)
], Movimiento.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => card_entity_1.Card, (card) => card.movimientos, { nullable: true }),
    __metadata("design:type", card_entity_1.Card)
], Movimiento.prototype, "card", void 0);
exports.Movimiento = Movimiento = __decorate([
    (0, typeorm_1.Entity)('movimientos')
], Movimiento);
//# sourceMappingURL=movimiento.entity.js.map