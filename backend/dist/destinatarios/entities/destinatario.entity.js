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
exports.Destinatario = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
let Destinatario = class Destinatario {
    id;
    propietario;
    nombre;
    rut;
    alias;
    correo_electronico;
    banco;
    tipo_cuenta;
    numero_cuenta;
    es_favorito;
};
exports.Destinatario = Destinatario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Destinatario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'propietario_id' }),
    __metadata("design:type", user_entity_1.User)
], Destinatario.prototype, "propietario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Destinatario.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Destinatario.prototype, "rut", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Destinatario.prototype, "alias", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correo_electronico', nullable: true }),
    __metadata("design:type", String)
], Destinatario.prototype, "correo_electronico", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Destinatario.prototype, "banco", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_cuenta' }),
    __metadata("design:type", String)
], Destinatario.prototype, "tipo_cuenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_cuenta' }),
    __metadata("design:type", String)
], Destinatario.prototype, "numero_cuenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Destinatario.prototype, "es_favorito", void 0);
exports.Destinatario = Destinatario = __decorate([
    (0, typeorm_1.Entity)('destinatarios')
], Destinatario);
//# sourceMappingURL=destinatario.entity.js.map