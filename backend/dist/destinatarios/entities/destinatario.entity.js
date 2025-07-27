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
const swagger_1 = require("@nestjs/swagger");
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
    (0, swagger_1.ApiProperty)({
        description: 'ID único del destinatario',
        example: 1,
        type: 'integer',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Destinatario.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario propietario de este destinatario',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'propietario_id' }),
    __metadata("design:type", user_entity_1.User)
], Destinatario.prototype, "propietario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del destinatario',
        example: 'María',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Destinatario.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RUT (Rol Único Tributario) del destinatario',
        example: '98765432-1',
        pattern: '^(\\d{7,8}-[kK0-9])$',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Destinatario.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alias o apodo para el destinatario (opcional)',
        example: 'Mi hermana',
        nullable: true,
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Destinatario.prototype, "alias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Correo electrónico del destinatario (opcional)',
        example: 'maria.gomez@example.com',
        format: 'email',
        nullable: true,
        required: false,
    }),
    (0, typeorm_1.Column)({ name: 'correo_electronico', nullable: true }),
    __metadata("design:type", String)
], Destinatario.prototype, "correo_electronico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del banco del destinatario',
        example: 'Banco Estado',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Destinatario.prototype, "banco", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de cuenta del destinatario (ej. Cuenta Corriente, Cuenta de Ahorro)',
        example: 'Cuenta Corriente',
    }),
    (0, typeorm_1.Column)({ name: 'tipo_cuenta' }),
    __metadata("design:type", String)
], Destinatario.prototype, "tipo_cuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de cuenta del destinatario',
        example: '1234567890',
    }),
    (0, typeorm_1.Column)({ name: 'numero_cuenta' }),
    __metadata("design:type", String)
], Destinatario.prototype, "numero_cuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el destinatario es marcado como favorito',
        example: false,
        default: false,
    }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Destinatario.prototype, "es_favorito", void 0);
exports.Destinatario = Destinatario = __decorate([
    (0, typeorm_1.Entity)('destinatarios')
], Destinatario);
//# sourceMappingURL=destinatario.entity.js.map