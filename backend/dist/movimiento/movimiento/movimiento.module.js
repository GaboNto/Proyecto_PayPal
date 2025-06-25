"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const movimiento_service_1 = require("./movimiento.service");
const movimiento_controller_1 = require("./movimiento.controller");
const movimiento_entity_1 = require("./movimiento.entity");
const cuentas_module_1 = require("../../cuentas/cuentas.module");
const cuenta_entity_1 = require("../../cuentas/entities/cuenta.entity");
let MovimientoModule = class MovimientoModule {
};
exports.MovimientoModule = MovimientoModule;
exports.MovimientoModule = MovimientoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([movimiento_entity_1.Movimiento, cuenta_entity_1.Cuenta]),
            cuentas_module_1.CuentasModule,
        ],
        providers: [movimiento_service_1.MovimientoService],
        controllers: [movimiento_controller_1.MovimientoController],
        exports: [movimiento_service_1.MovimientoService, typeorm_1.TypeOrmModule]
    })
], MovimientoModule);
//# sourceMappingURL=movimiento.module.js.map