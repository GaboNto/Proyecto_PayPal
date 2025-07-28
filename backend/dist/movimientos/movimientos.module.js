"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientosModule = void 0;
const common_1 = require("@nestjs/common");
const movimientos_service_1 = require("./movimientos.service");
const movimientos_controller_1 = require("./movimientos.controller");
const typeorm_1 = require("@nestjs/typeorm");
const transferencia_entity_1 = require("../transfers/entities/transferencia.entity");
const auth_module_1 = require("../auth/auth.module");
const pago_entity_1 = require("../pagos/entities/pago.entity");
const user_entity_1 = require("../users/user.entity");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
let MovimientosModule = class MovimientosModule {
};
exports.MovimientosModule = MovimientosModule;
exports.MovimientosModule = MovimientosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transferencia_entity_1.Transferencia, pago_entity_1.Pago, user_entity_1.User, cuenta_entity_1.Cuenta]),
            auth_module_1.AuthModule,
        ],
        controllers: [movimientos_controller_1.MovimientosController],
        providers: [movimientos_service_1.MovimientosService],
        exports: [movimientos_service_1.MovimientosService],
    })
], MovimientosModule);
//# sourceMappingURL=movimientos.module.js.map