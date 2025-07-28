/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoService } from './movimiento.service';
import { MovimientoController } from './movimiento.controller';
import { Movimiento } from './movimiento.entity';
import { CuentasModule } from 'src/cuentas/cuentas.module';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movimiento, Cuenta]),
    CuentasModule,
  ],
  providers: [MovimientoService],
  controllers: [MovimientoController],
  exports: [MovimientoService, TypeOrmModule] 
})
export class MovimientoModule {}