"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotModule = void 0;
const common_1 = require("@nestjs/common");
const chatbot_service_1 = require("./chatbot.service");
const chatbot_controller_1 = require("./chatbot.controller");
const typeorm_1 = require("@nestjs/typeorm");
const pago_entity_1 = require("../pagos/entities/pago.entity");
const user_entity_1 = require("../users/user.entity");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
let ChatbotModule = class ChatbotModule {
};
exports.ChatbotModule = ChatbotModule;
exports.ChatbotModule = ChatbotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([pago_entity_1.Pago, user_entity_1.User, cuenta_entity_1.Cuenta])
        ],
        controllers: [chatbot_controller_1.ChatbotController],
        providers: [chatbot_service_1.ChatbotService],
    })
], ChatbotModule);
//# sourceMappingURL=chatbot.module.js.map