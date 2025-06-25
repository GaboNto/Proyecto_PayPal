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
exports.Card = void 0;
const typeorm_1 = require("typeorm");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
let Card = class Card {
    id;
    cardNumber;
    cvv;
    expirationDate;
    is_blocked;
    cuenta;
};
exports.Card = Card;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Card.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], Card.prototype, "cardNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3 }),
    __metadata("design:type", String)
], Card.prototype, "cvv", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Card.prototype, "expirationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Card.prototype, "is_blocked", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cuenta_entity_1.Cuenta, cuenta => cuenta.cards, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_cuenta' }),
    __metadata("design:type", cuenta_entity_1.Cuenta)
], Card.prototype, "cuenta", void 0);
exports.Card = Card = __decorate([
    (0, typeorm_1.Entity)('card')
], Card);
//# sourceMappingURL=card.entity.js.map