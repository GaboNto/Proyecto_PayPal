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
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El RUT es requerido.' }),
    (0, class_validator_1.Matches)(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "rut", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "alias", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "correo_electronico", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El banco es requerido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "banco", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de cuenta es requerido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "tipo_cuenta", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de cuenta es requerido.' }),
    __metadata("design:type", String)
], CreateDestinatarioDto.prototype, "numero_cuenta", void 0);
//# sourceMappingURL=create-destinatario.dto.js.map