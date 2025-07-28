"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinatariosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const destinatarios_service_1 = require("./destinatarios.service");
const destinatarios_controller_1 = require("./destinatarios.controller");
const destinatario_entity_1 = require("./entities/destinatario.entity");
const users_module_1 = require("../users/users.module");
let DestinatariosModule = class DestinatariosModule {
};
exports.DestinatariosModule = DestinatariosModule;
exports.DestinatariosModule = DestinatariosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([destinatario_entity_1.Destinatario]),
            users_module_1.UsersModule
        ],
        controllers: [destinatarios_controller_1.DestinatariosController],
        providers: [destinatarios_service_1.DestinatariosService],
    })
], DestinatariosModule);
//# sourceMappingURL=destinatarios.module.js.map