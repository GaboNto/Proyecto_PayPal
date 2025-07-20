/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CardModule } from './card/card.module';
import { MovimientoModule } from './movimiento/movimiento/movimiento.module';
import { User } from './users/user.entity';
import { Movimiento } from './movimiento/movimiento/movimiento.entity';
import { Card } from './card/card.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TransfersModule } from './transfers/transfers.module';
import { CuentasModule } from './cuentas/cuentas.module';
import { Cuenta } from './cuentas/entities/cuenta.entity';
import { Transferencia } from './transfers/entities/transferencia.entity';
import { UsuarioExterno } from './transfers/entities/usuario-externo.entity';
import { DestinatariosModule } from './destinatarios/destinatarios.module';
import { Destinatario } from './destinatarios/entities/destinatario.entity';
import { PagosModule } from './pagos/pagos.module';
import { Pago } from './pagos/entities/pago.entity';
import { ChatbotModule } from './chatbot/chatbot.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import * as crypto from 'crypto';



@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Movimiento, Card, Cuenta, Transferencia, UsuarioExterno, Destinatario,Pago], 
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CardModule,
    MovimientoModule,
    TransfersModule,
    CuentasModule,
    DestinatariosModule,
    PagosModule,
    ChatbotModule,
    MovimientosModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
