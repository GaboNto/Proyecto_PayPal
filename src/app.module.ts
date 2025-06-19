/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CardModule } from './card/card.module';
import { SaldoModule } from './saldo/saldo/saldo.module';
import { MovimientoModule } from './movimiento/movimiento/movimiento.module';
import { User } from './users/user.entity';
import { Saldo } from './saldo/saldo/saldo.entity';
import { Movimiento } from './movimiento/movimiento/movimiento.entity';
import { Card } from './card/card.entity';

@Module({
  imports: [
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
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Saldo, Movimiento, Card], 
        //entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CardModule,
    SaldoModule,
    MovimientoModule,
  ],
  providers: [AppService], // Asegúrate de que el servicio esté registrado
})
export class AppModule {}
