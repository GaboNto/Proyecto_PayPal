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
exports.UsuarioExterno = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let UsuarioExterno = class UsuarioExterno {
    id;
    nombre;
    rut;
    banco;
    tipo_cuenta;
    numero_cuenta;
    saldo;
};
exports.UsuarioExterno = UsuarioExterno;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del usuario externo',
        example: 1,
        type: 'integer',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UsuarioExterno.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del usuario externo',
        example: 'Carlos Gómez',
        maxLength: 100,
    }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], UsuarioExterno.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RUT (Rol Único Tributario) del usuario externo',
        example: '12345678-9',
        maxLength: 12,
        uniqueItems: true,
    }),
    (0, typeorm_1.Column)({ length: 12, unique: true }),
    __metadata("design:type", String)
], UsuarioExterno.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del banco del usuario externo',
        example: 'Banco de Chile',
        maxLength: 50,
    }),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], UsuarioExterno.prototype, "banco", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de cuenta del usuario externo (ej. Cuenta Corriente, Cuenta de Ahorro)',
        example: 'Cuenta Corriente',
        maxLength: 50,
    }),
    (0, typeorm_1.Column)({ name: 'tipo_cuenta', length: 50 }),
    __metadata("design:type", String)
], UsuarioExterno.prototype, "tipo_cuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de cuenta del usuario externo',
        example: '987654321',
        maxLength: 30,
    }),
    (0, typeorm_1.Column)({ name: 'numero_cuenta', length: 30 }),
    __metadata("design:type", String)
], UsuarioExterno.prototype, "numero_cuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Saldo de la cuenta del usuario externo (puede ser 0 si no se gestiona saldo aquí)',
        example: 0.00,
        type: 'number',
        format: 'float',
        default: 0,
    }),
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UsuarioExterno.prototype, "saldo", void 0);
exports.UsuarioExterno = UsuarioExterno = __decorate([
    (0, typeorm_1.Entity)('usuarios_externos')
], UsuarioExterno);
//# sourceMappingURL=usuario-externo.entity.js.map