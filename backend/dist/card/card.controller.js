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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const common_1 = require("@nestjs/common");
const card_service_1 = require("./card.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let CardController = class CardController {
    cardService;
    constructor(cardService) {
        this.cardService = cardService;
    }
    toggleBlockStatus(id, req) {
        return this.cardService.toggleBlock(id, req.user);
    }
};
exports.CardController = CardController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/toggle-block'),
    (0, swagger_1.ApiOperation)({ summary: 'Bloquear o desbloquear una tarjeta' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'string',
        description: 'UUID de la tarjeta a modificar',
        example: 'a24e34ff-f1a9-4bc3-90c9-d2b5d82e59b7',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de bloqueo de la tarjeta actualizado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'ID de tarjeta inválido' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CardController.prototype, "toggleBlockStatus", null);
exports.CardController = CardController = __decorate([
    (0, swagger_1.ApiTags)('cards'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('cards'),
    __metadata("design:paramtypes", [card_service_1.CardService])
], CardController);
//# sourceMappingURL=card.controller.js.map