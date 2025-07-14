"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const card_module_1 = require("./card/card.module");
const movimiento_module_1 = require("./movimiento/movimiento/movimiento.module");
const user_entity_1 = require("./users/user.entity");
const movimiento_entity_1 = require("./movimiento/movimiento/movimiento.entity");
const card_entity_1 = require("./card/card.entity");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const transfers_module_1 = require("./transfers/transfers.module");
const cuentas_module_1 = require("./cuentas/cuentas.module");
const cuenta_entity_1 = require("./cuentas/entities/cuenta.entity");
const transferencia_entity_1 = require("./transfers/entities/transferencia.entity");
const usuario_externo_entity_1 = require("./transfers/entities/usuario-externo.entity");
const destinatarios_module_1 = require("./destinatarios/destinatarios.module");
const destinatario_entity_1 = require("./destinatarios/entities/destinatario.entity");
const pagos_module_1 = require("./pagos/pagos.module");
const pago_entity_1 = require("./pagos/entities/pago.entity");
const crypto = require("crypto");
global.crypto = crypto;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: +configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [user_entity_1.User, movimiento_entity_1.Movimiento, card_entity_1.Card, cuenta_entity_1.Cuenta, transferencia_entity_1.Transferencia, usuario_externo_entity_1.UsuarioExterno, destinatario_entity_1.Destinatario, pago_entity_1.Pago],
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            card_module_1.CardModule,
            movimiento_module_1.MovimientoModule,
            transfers_module_1.TransfersModule,
            cuentas_module_1.CuentasModule,
            destinatarios_module_1.DestinatariosModule,
            pagos_module_1.PagosModule,
        ],
        providers: [app_service_1.AppService],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map