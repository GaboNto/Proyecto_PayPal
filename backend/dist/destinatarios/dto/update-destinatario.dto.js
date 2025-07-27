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
exports.UpdateDestinatarioDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateDestinatarioDto {
    nombre;
    rut;
    alias;
    correo_electronico;
    banco;
    tipo_cuenta;
    numero_cuenta;
}
exports.UpdateDestinatarioDto = UpdateDestinatarioDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo nombre del destinatario (opcional para actualización)',
        example: 'Ana',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDestinatarioDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo RUT del destinatario (opcional para actualización)',
        example: '99888777-6',
        pattern: '^[0-9]{1,2}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9kK]{1}$',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.' }),
    __metadata("design:type", String)
], UpdateDestinatarioDto.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo alias o apodo para el destinatario (opcional para actualización)',
        example: 'Hermana de la U',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDestinatarioDto.prototype, "alias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo correo electrónico del destinatario (opcional para actualización)',
        example: 'ana.lopez@example.com',
        format: 'email',
        required: false,
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDestinatarioDto.prototype, "correo_electronico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo nombre del banco del destinatario (opcional para actualización)',
        example: 'Banco Santander',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDestinatarioDto.prototype, "banco", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo tipo de cuenta del destinatario (opcional para actualización)',
        example: 'Cuenta de Ahorro',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDestinatarioDto.prototype, "tipo_cuenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo número de cuenta del destinatario (opcional para actualización)',
        example: '123456789',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDestinatarioDto.prototype, "numero_cuenta", void 0);
//# sourceMappingURL=update-destinatario.dto.js.map