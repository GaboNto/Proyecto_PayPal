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
exports.CreateCardDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCardDto {
    cardNumber;
    cvv;
    expirationDate;
}
exports.CreateCardDto = CreateCardDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' }),
    __metadata("design:type", String)
], CreateCardDto.prototype, "cardNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3, { message: 'El CVV debe tener 3 dígitos' }),
    __metadata("design:type", String)
], CreateCardDto.prototype, "cvv", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(0[1-9]|1[0-2])\/\d{2}$/, {
        message: 'La fecha debe tener el formato MM/YY',
    }),
    __metadata("design:type", String)
], CreateCardDto.prototype, "expirationDate", void 0);
//# sourceMappingURL=createcard.dto.js.map