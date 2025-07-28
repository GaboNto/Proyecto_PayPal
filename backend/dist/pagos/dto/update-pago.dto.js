"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePagoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_pago_dto_1 = require("./create-pago.dto");
class UpdatePagoDto extends (0, swagger_1.PartialType)(create_pago_dto_1.CreatePagoDto) {
}
exports.UpdatePagoDto = UpdatePagoDto;
//# sourceMappingURL=update-pago.dto.js.map