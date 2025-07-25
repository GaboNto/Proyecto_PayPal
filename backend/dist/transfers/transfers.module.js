"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transfers_service_1 = require("./transfers.service");
const transfers_controller_1 = require("./transfers.controller");
const transferencia_entity_1 = require("./entities/transferencia.entity");
const usuario_externo_entity_1 = require("./entities/usuario-externo.entity");
const user_entity_1 = require("../users/user.entity");
const auth_module_1 = require("../auth/auth.module");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
const historial_saldos_1 = require("./entities/historial-saldos");
const email_service_1 = require("../email/email.service");
let TransfersModule = class TransfersModule {
};
exports.TransfersModule = TransfersModule;
exports.TransfersModule = TransfersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transferencia_entity_1.Transferencia, usuario_externo_entity_1.UsuarioExterno, user_entity_1.User, cuenta_entity_1.Cuenta, historial_saldos_1.HistorialSaldos]),
            auth_module_1.AuthModule,
        ],
        controllers: [transfers_controller_1.TransfersController],
        providers: [transfers_service_1.TransfersService, email_service_1.EmailService],
    })
], TransfersModule);
//# sourceMappingURL=transfers.module.js.map