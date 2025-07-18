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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cuenta = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const movimiento_entity_1 = require("../../movimiento/movimiento/movimiento.entity");
const card_entity_1 = require("../../card/card.entity");
let Cuenta = class Cuenta {
    id;
    usuario;
    numero_cuenta;
    tipo_cuenta;
    saldo;
    fecha_apertura;
    movimientos;
    cards;
};
exports.Cuenta = Cuenta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cuenta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.cuentas, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario' }),
    __metadata("design:type", user_entity_1.User)
], Cuenta.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_cuenta', length: 30, unique: true }),
    __metadata("design:type", String)
], Cuenta.prototype, "numero_cuenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_cuenta', length: 50, default: 'Cuenta Vista' }),
    __metadata("design:type", String)
], Cuenta.prototype, "tipo_cuenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cuenta.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_apertura', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Cuenta.prototype, "fecha_apertura", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movimiento_entity_1.Movimiento, movimiento => movimiento.cuenta),
    __metadata("design:type", Array)
], Cuenta.prototype, "movimientos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => card_entity_1.Card, card => card.cuenta),
    __metadata("design:type", Array)
], Cuenta.prototype, "cards", void 0);
exports.Cuenta = Cuenta = __decorate([
    (0, typeorm_1.Entity)('cuentas')
], Cuenta);
//# sourceMappingURL=cuenta.entity.js.map