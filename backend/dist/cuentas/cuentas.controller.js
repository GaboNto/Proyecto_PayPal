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
exports.CuentasController = void 0;
const common_1 = require("@nestjs/common");
const cuentas_service_1 = require("./cuentas.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let CuentasController = class CuentasController {
    cuentasService;
    constructor(cuentasService) {
        this.cuentasService = cuentasService;
    }
    findUserAccounts(req) {
        return this.cuentasService.findByUserId(req.user.sub);
    }
    createAccount(req, body) {
        return this.cuentasService.create(req.user.sub, body.tipo_cuenta);
    }
};
exports.CuentasController = CuentasController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener cuentas del usuario autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listado de cuentas devuelto correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CuentasController.prototype, "findUserAccounts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva cuenta para el usuario autenticado' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                tipo_cuenta: {
                    type: 'string',
                    example: 'corriente',
                    description: 'Tipo de cuenta a crear (ej. corriente, vista, ahorro)',
                },
            },
            required: ['tipo_cuenta'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cuenta creada correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CuentasController.prototype, "createAccount", null);
exports.CuentasController = CuentasController = __decorate([
    (0, swagger_1.ApiTags)('Cuentas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('cuentas'),
    __metadata("design:paramtypes", [cuentas_service_1.CuentasService])
], CuentasController);
//# sourceMappingURL=cuentas.controller.js.map