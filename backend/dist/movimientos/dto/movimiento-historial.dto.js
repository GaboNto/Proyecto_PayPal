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
exports.MovimientoHistorialDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MovimientoHistorialDto {
    fecha;
    descripcion;
    categoria;
    abono;
}
exports.MovimientoHistorialDto = MovimientoHistorialDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora del movimiento',
        example: '2025-07-27T10:00:00.000Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], MovimientoHistorialDto.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del movimiento',
        example: 'Compra en supermercado',
    }),
    __metadata("design:type", String)
], MovimientoHistorialDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoría del movimiento',
        example: 'Alimentos',
    }),
    __metadata("design:type", String)
], MovimientoHistorialDto.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto del abono o cargo (positivo para ingresos, negativo para gastos)',
        example: -5000.00,
        type: 'number',
        format: 'float',
    }),
    __metadata("design:type", Number)
], MovimientoHistorialDto.prototype, "abono", void 0);
//# sourceMappingURL=movimiento-historial.dto.js.map