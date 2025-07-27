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
exports.ForgotPasswordDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ForgotPasswordDto {
    email;
    nombre;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'La dirección de correo electrónico del usuario para restablecer la contraseña.',
        example: 'usuario@example.com',
        format: 'email',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo electrónico no puede estar vacío.' }),
    (0, class_validator_1.IsEmail)({}, { message: 'El formato del correo electrónico es inválido.' }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'El nombre del usuario (opcional, puede ser usado para personalización del email).',
        example: 'Juan',
        required: false,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre no puede estar vacío.' }),
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser una cadena de texto.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "nombre", void 0);
//# sourceMappingURL=forgot-password.dto.js.map