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
exports.SendPasswordResetEmailDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SendPasswordResetEmailDto {
    to;
}
exports.SendPasswordResetEmailDto = SendPasswordResetEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'La dirección de correo electrónico del destinatario del correo de restablecimiento.',
        example: 'destinatario@example.com',
        format: 'email',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo electrónico es obligatorio.' }),
    __metadata("design:type", String)
], SendPasswordResetEmailDto.prototype, "to", void 0);
//# sourceMappingURL=send-password-reset-email.dto.js.map