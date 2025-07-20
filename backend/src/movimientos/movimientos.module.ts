/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transferencia } from 'src/transfers/entities/transferencia.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Pago } from 'src/pagos/entities/pago.entity';
import { User } from 'src/users/user.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transferencia, Pago, User, Cuenta]),
    AuthModule,
  ],
  controllers: [MovimientosController],
  providers: [MovimientosService],
})
export class MovimientosModule { }
