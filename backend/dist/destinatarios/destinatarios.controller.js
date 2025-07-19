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
exports.DestinatariosController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const destinatarios_service_1 = require("./destinatarios.service");
const create_destinatario_dto_1 = require("./dto/create-destinatario.dto");
const users_service_1 = require("../users/users.service");
const update_destinatario_dto_1 = require("./dto/update-destinatario.dto");
const swagger_1 = require("@nestjs/swagger");
let DestinatariosController = class DestinatariosController {
    destinatariosService;
    usersService;
    constructor(destinatariosService, usersService) {
        this.destinatariosService = destinatariosService;
        this.usersService = usersService;
    }
    async create(createDestinatarioDto, req) {
        const userId = req.user.sub;
        const propietario = await this.usersService.findById(userId);
        return this.destinatariosService.create(createDestinatarioDto, propietario);
    }
    async findAll(req) {
        const userId = req.user.sub;
        return this.destinatariosService.findByPropietarioId(userId);
    }
    async update(id, updateDestinatarioDto, req) {
        const userId = req.user.sub;
        return this.destinatariosService.update(id, userId, updateDestinatarioDto);
    }
    async remove(id, req) {
        const userId = req.user.sub;
        return this.destinatariosService.delete(id, userId);
    }
    async toggleFavorito(id, req) {
        const userId = req.user.sub;
        return this.destinatariosService.toggleFavorito(id, userId);
    }
};
exports.DestinatariosController = DestinatariosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo destinatario' }),
    (0, swagger_1.ApiBody)({ type: create_destinatario_dto_1.CreateDestinatarioDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Destinatario creado correctamente',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_destinatario_dto_1.CreateDestinatarioDto, Object]),
    __metadata("design:returntype", Promise)
], DestinatariosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los destinatarios del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de destinatarios obtenida correctamente',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DestinatariosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un destinatario existente' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del destinatario' }),
    (0, swagger_1.ApiBody)({ type: update_destinatario_dto_1.UpdateDestinatarioDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Destinatario actualizado correctamente',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_destinatario_dto_1.UpdateDestinatarioDto, Object]),
    __metadata("design:returntype", Promise)
], DestinatariosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un destinatario por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del destinatario' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Destinatario eliminado correctamente',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DestinatariosController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/favorito'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar o desmarcar destinatario como favorito' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del destinatario' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estado de favorito actualizado correctamente',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DestinatariosController.prototype, "toggleFavorito", null);
exports.DestinatariosController = DestinatariosController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('destinatarios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('destinatarios'),
    __metadata("design:paramtypes", [destinatarios_service_1.DestinatariosService,
        users_service_1.UsersService])
], DestinatariosController);
//# sourceMappingURL=destinatarios.controller.js.map