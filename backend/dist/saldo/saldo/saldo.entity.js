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
exports.Saldo = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const movimiento_entity_1 = require("../../movimiento/movimiento/movimiento.entity");
let Saldo = class Saldo {
    id;
    amount;
    user;
    movimientos;
};
exports.Saldo = Saldo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Saldo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Saldo.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, user => user.saldo),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Saldo.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movimiento_entity_1.Movimiento, movimiento => movimiento.saldo),
    __metadata("design:type", Array)
], Saldo.prototype, "movimientos", void 0);
exports.Saldo = Saldo = __decorate([
    (0, typeorm_1.Entity)('saldos')
], Saldo);
//# sourceMappingURL=saldo.entity.js.map