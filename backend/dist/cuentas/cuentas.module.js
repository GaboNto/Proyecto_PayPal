"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuentasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cuentas_service_1 = require("./cuentas.service");
const cuentas_controller_1 = require("./cuentas.controller");
const cuenta_entity_1 = require("./entities/cuenta.entity");
const auth_module_1 = require("../auth/auth.module");
const user_entity_1 = require("../users/user.entity");
const card_entity_1 = require("../card/card.entity");
let CuentasModule = class CuentasModule {
};
exports.CuentasModule = CuentasModule;
exports.CuentasModule = CuentasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cuenta_entity_1.Cuenta, user_entity_1.User, card_entity_1.Card]), auth_module_1.AuthModule],
        controllers: [cuentas_controller_1.CuentasController],
        providers: [cuentas_service_1.CuentasService],
        exports: [cuentas_service_1.CuentasService],
    })
], CuentasModule);
//# sourceMappingURL=cuentas.module.js.map