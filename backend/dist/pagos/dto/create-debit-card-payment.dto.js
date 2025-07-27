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
exports.CreateDebitCardPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDebitCardPaymentDto {
    numeroCuenta;
    monto;
    descripcion;
    cardNumber;
    cvv;
    expirationDate;
}
exports.CreateDebitCardPaymentDto = CreateDebitCardPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'El número de cuenta desde la cual se debitará el dinero.',
        example: '9876543210',
    }),
    (0, class_validator_1.IsString)({ message: 'El número de cuenta debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de cuenta es obligatorio.' }),
    __metadata("design:type", String)
], CreateDebitCardPaymentDto.prototype, "numeroCuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto del pago. Debe ser un número positivo.',
        example: 150.75,
        type: 'number',
        format: 'float',
        minimum: 0.01,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El monto debe ser un número.' }),
    (0, class_validator_1.Min)(0.01, { message: 'El monto debe ser positivo.' }),
    __metadata("design:type", Number)
], CreateDebitCardPaymentDto.prototype, "monto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del pago.',
        example: 'Pago de factura de luz',
    }),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La descripción es obligatoria.' }),
    __metadata("design:type", String)
], CreateDebitCardPaymentDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de la tarjeta de débito (16 dígitos).',
        example: '1111222233334444',
        minLength: 16,
        maxLength: 16,
    }),
    (0, class_validator_1.IsString)({ message: 'El número de tarjeta debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de tarjeta es obligatorio.' }),
    (0, class_validator_1.Length)(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos.' }),
    __metadata("design:type", String)
], CreateDebitCardPaymentDto.prototype, "cardNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código de seguridad CVV de la tarjeta (3 o 4 dígitos).',
        example: '567',
        minLength: 3,
        maxLength: 4,
    }),
    (0, class_validator_1.IsString)({ message: 'El CVV debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El CVV es obligatorio.' }),
    (0, class_validator_1.Length)(3, 4, { message: 'El CVV debe tener 3 o 4 dígitos.' }),
    __metadata("design:type", String)
], CreateDebitCardPaymentDto.prototype, "cvv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de expiración de la tarjeta en formato MM/YY.',
        example: '10/26',
        pattern: '^(0[1-9]|1[0-2])\\/\\d{2}$',
    }),
    (0, class_validator_1.IsString)({ message: 'La fecha de expiración debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de expiración es obligatoria.' }),
    (0, class_validator_1.Matches)(/^(0[1-9]|1[0-2])\/\d{2}$/, {
        message: 'La fecha de expiración debe tener el formato MM/YY (ej. 12/25).',
    }),
    __metadata("design:type", String)
], CreateDebitCardPaymentDto.prototype, "expirationDate", void 0);
//# sourceMappingURL=create-debit-card-payment.dto.js.map