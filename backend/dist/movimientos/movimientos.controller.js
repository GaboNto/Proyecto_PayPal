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
exports.MovimientosController = void 0;
const common_1 = require("@nestjs/common");
const movimientos_service_1 = require("./movimientos.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MovimientosController = class MovimientosController {
    movimientosService;
    constructor(movimientosService) {
        this.movimientosService = movimientosService;
    }
    async getMovimientos(req) {
        const userId = req.user.sub;
        return this.movimientosService.obtenerMovimientosPorUsuario(userId);
    }
    async obtenerHistorial(req) {
        const userId = req.user.sub;
        const historial = this.movimientosService.obtenerMovimientosPorUsuario(userId);
        return historial;
    }
};
exports.MovimientosController = MovimientosController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "getMovimientos", null);
__decorate([
    (0, common_1.Get)('historial'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MovimientosController.prototype, "obtenerHistorial", null);
exports.MovimientosController = MovimientosController = __decorate([
    (0, common_1.Controller)('movimientos'),
    __metadata("design:paramtypes", [movimientos_service_1.MovimientosService])
], MovimientosController);
//# sourceMappingURL=movimientos.controller.js.map