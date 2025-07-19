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
exports.CreateDestinatarioDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDestinatarioDto {
    nombre;
    rut;
    alias;
    correo_electronico;
    banco;
    tipo_cuenta;
    numero_cuenta;
}
exports.CreateDestinatarioDto = CreateDestinatarioDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre completo del destinatario',
        example: 'felipe lopez'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RUT chileno del destinatario',
        example: '12.345.678-9'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT es requerido.' }),
    (0, class_validator_1.Matches)(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alias del destinatario',
        example: 'juan uta'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "alias", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Correo electrónico del destinatario (opcional)',
        example: 'correo@gmail.com'
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "correo_electronico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Banco asociado a la cuenta del destinatario',
        example: 'Banco Estado'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El banco es requerido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "banco", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de cuenta bancaria del destinatario',
        example: 'Cuenta Corriente'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de cuenta es requerido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "tipo_cuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de cuenta bancaria del destinatario',
        example: '123456789'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de cuenta es requerido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "numero_cuenta", void 0);
//# sourceMappingURL=create-destinatario.dto.js.map