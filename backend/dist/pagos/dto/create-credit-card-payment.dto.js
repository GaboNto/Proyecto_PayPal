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
exports.CreateCreditCardPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCreditCardPaymentDto {
    numeroCuenta;
    monto;
    descripcion;
    cardNumber;
    cvv;
    expirationDate;
}
exports.CreateCreditCardPaymentDto = CreateCreditCardPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de cuenta del usuario (opcional, para asociar el pago a una cuenta específica).',
        example: '1234567890',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El número de cuenta debe ser una cadena de texto.' }),
    __metadata("design:type", String)
], CreateCreditCardPaymentDto.prototype, "numeroCuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto del pago. Debe ser un número positivo.',
        example: 250.50,
        type: 'number',
        format: 'float',
        minimum: 0.01,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El monto debe ser un número.' }),
    (0, class_validator_1.Min)(0.01, { message: 'El monto debe ser positivo.' }),
    __metadata("design:type", Number)
], CreateCreditCardPaymentDto.prototype, "monto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del pago.',
        example: 'Compra en tienda de ropa',
    }),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La descripción es obligatoria.' }),
    __metadata("design:type", String)
], CreateCreditCardPaymentDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de la tarjeta de crédito/débito (16 dígitos).',
        example: '4111222233334444',
        minLength: 16,
        maxLength: 16,
    }),
    (0, class_validator_1.IsString)({ message: 'El número de tarjeta debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de tarjeta es obligatorio.' }),
    (0, class_validator_1.Length)(16, 16, { message: 'El número de tarjeta de crédito debe tener 16 dígitos.' }),
    __metadata("design:type", String)
], CreateCreditCardPaymentDto.prototype, "cardNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código de seguridad CVV de la tarjeta (3 o 4 dígitos).',
        example: '123',
        minLength: 3,
        maxLength: 4,
    }),
    (0, class_validator_1.IsString)({ message: 'El CVV debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El CVV es obligatorio.' }),
    (0, class_validator_1.Length)(3, 4, { message: 'El CVV debe tener 3 o 4 dígitos.' }),
    __metadata("design:type", String)
], CreateCreditCardPaymentDto.prototype, "cvv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de expiración de la tarjeta en formato MM/YY.',
        example: '12/28',
        pattern: '^([1-9]|1[0-2])\\/\\d{2}$',
    }),
    (0, class_validator_1.IsString)({ message: 'La fecha de expiración debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La fecha de expiración es obligatoria.' }),
    (0, class_validator_1.Matches)(/^([1-9]|1[0-2])\/\d{2}$/, {
        message: 'La fecha de expiración debe tener el formato MM/YY (ej. 12/25).',
    }),
    __metadata("design:type", String)
], CreateCreditCardPaymentDto.prototype, "expirationDate", void 0);
//# sourceMappingURL=create-credit-card-payment.dto.js.map