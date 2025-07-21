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
exports.Transferencia = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const usuario_externo_entity_1 = require("./usuario-externo.entity");
let Transferencia = class Transferencia {
    id;
    usuario_origen;
    usuario_id_origen;
    usuario_destino;
    id_usuario_destino;
    usuario_externo;
    id_usuario_externo;
    cuenta_origen;
    cuenta_destino;
    monto;
    comision;
    fecha;
};
exports.Transferencia = Transferencia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transferencia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id_origen' }),
    __metadata("design:type", user_entity_1.User)
], Transferencia.prototype, "usuario_origen", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transferencia.prototype, "usuario_id_origen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario_destino' }),
    __metadata("design:type", user_entity_1.User)
], Transferencia.prototype, "usuario_destino", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Transferencia.prototype, "id_usuario_destino", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_externo_entity_1.UsuarioExterno, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario_externo' }),
    __metadata("design:type", usuario_externo_entity_1.UsuarioExterno)
], Transferencia.prototype, "usuario_externo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Transferencia.prototype, "id_usuario_externo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Transferencia.prototype, "cuenta_origen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Transferencia.prototype, "cuenta_destino", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Transferencia.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Transferencia.prototype, "comision", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Transferencia.prototype, "fecha", void 0);
exports.Transferencia = Transferencia = __decorate([
    (0, typeorm_1.Entity)('transferencias')
], Transferencia);
//# sourceMappingURL=transferencia.entity.js.map