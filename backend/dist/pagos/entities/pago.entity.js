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
exports.Pago = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/user.entity");
const swagger_1 = require("@nestjs/swagger");
let Pago = class Pago {
    id;
    usuario;
    idusuario;
    monto;
    descripcion;
    categoria;
    fecha;
};
exports.Pago = Pago;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del pago',
        example: 1,
        type: 'integer',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pago.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario asociado a este pago',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'idusuario' }),
    __metadata("design:type", user_entity_1.User)
], Pago.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario asociado al pago',
        example: 123,
        type: 'integer',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pago.prototype, "idusuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto del pago',
        example: 150.75,
        type: 'number',
        format: 'float',
    }),
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Pago.prototype, "monto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del pago',
        example: 'Compra de víveres en supermercado',
    }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Pago.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoría del pago',
        example: 'Alimentos',
        maxLength: 100,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Pago.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora en que se realizó el pago',
        example: '2025-07-27T10:00:00.000Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Pago.prototype, "fecha", void 0);
exports.Pago = Pago = __decorate([
    (0, typeorm_1.Entity)('pagos')
], Pago);
//# sourceMappingURL=pago.entity.js.map