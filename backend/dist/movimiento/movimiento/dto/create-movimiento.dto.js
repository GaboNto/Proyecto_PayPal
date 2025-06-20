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
exports.CreateMovimientoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateMovimientoDto {
    amount;
    type;
}
exports.CreateMovimientoDto = CreateMovimientoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La cantidad no puede estar vacía' }),
    (0, class_validator_1.IsNumber)({}, { message: 'La cantidad debe ser un número' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un número positivo' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateMovimientoDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de movimiento no puede estar vacío' }),
    (0, class_validator_1.IsString)({ message: 'El tipo de movimiento debe ser una cadena de texto' }),
    (0, class_validator_1.IsIn)(['deposito', 'retiro', 'transferencia'], { message: 'Tipo de movimiento no válido' }),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "type", void 0);
//# sourceMappingURL=create-movimiento.dto.js.map