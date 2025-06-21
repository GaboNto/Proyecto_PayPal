"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaldoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const saldo_service_1 = require("./saldo.service");
const saldo_controller_1 = require("./saldo.controller");
const saldo_entity_1 = require("./saldo.entity");
let SaldoModule = class SaldoModule {
};
exports.SaldoModule = SaldoModule;
exports.SaldoModule = SaldoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([saldo_entity_1.Saldo])
        ],
        providers: [saldo_service_1.SaldoService],
        controllers: [saldo_controller_1.SaldoController],
        exports: [saldo_service_1.SaldoService, typeorm_1.TypeOrmModule]
    })
], SaldoModule);
//# sourceMappingURL=saldo.module.js.map