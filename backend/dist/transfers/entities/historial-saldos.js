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
exports.HistorialSaldos = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let HistorialSaldos = class HistorialSaldos {
    id;
    numero_cuenta;
    saldo;
    fecha;
};
exports.HistorialSaldos = HistorialSaldos;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del registro de historial de saldos',
        example: 1,
        type: 'integer',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistorialSaldos.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de cuenta al que corresponde este registro de saldo',
        example: 'CL1234567890',
        maxLength: 30,
    }),
    (0, typeorm_1.Column)({ name: 'numero_cuenta', length: 30 }),
    __metadata("design:type", String)
], HistorialSaldos.prototype, "numero_cuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Saldo registrado en la fecha correspondiente',
        example: 1500000.00,
        type: 'number',
        format: 'float',
    }),
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], HistorialSaldos.prototype, "saldo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora del registro del saldo',
        example: '2025-07-27T10:00:00.000Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], HistorialSaldos.prototype, "fecha", void 0);
exports.HistorialSaldos = HistorialSaldos = __decorate([
    (0, typeorm_1.Entity)('historial-saldos')
], HistorialSaldos);
//# sourceMappingURL=historial-saldos.js.map