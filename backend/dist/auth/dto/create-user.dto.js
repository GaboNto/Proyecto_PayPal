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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserDto {
    nombre;
    apellido;
    email;
    password;
    fecha_nacimiento;
    ciudad;
    pais;
    rut;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'El nombre no puede exceder los 50 caracteres' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El apellido es obligatorio' }),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateUserDto.prototype, "apellido", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo no tiene un formato válido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    (0, class_validator_1.MaxLength)(32, { message: 'La contraseña no debe exceder los 32 caracteres' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de nacimiento debe tener formato ISO (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La ciudad es obligatoria' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "ciudad", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El país es obligatorio' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "pais", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(\d{7,8}-[kK0-9])$/, {
        message: 'El RUT debe tener el formato correcto, por ejemplo: 12345678-9'
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "rut", void 0);
//# sourceMappingURL=create-user.dto.js.map