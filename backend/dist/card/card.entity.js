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
const user_entity_1 = require("../users/user.entity");
const movimiento_entity_1 = require("../movimiento/movimiento/movimiento.entity");
let Card = class Card {
    id;
    cardNumber;
    cvv;
    expirationDate;
    user;
    movimientos;
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
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Card.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movimiento_entity_1.Movimiento, (movimiento) => movimiento.card),
    __metadata("design:type", Array)
], Card.prototype, "movimientos", void 0);
exports.Card = Card = __decorate([
    (0, typeorm_1.Entity)()
], Card);
//# sourceMappingURL=card.entity.js.map