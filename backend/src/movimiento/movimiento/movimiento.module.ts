/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoService } from './movimiento.service';
import { MovimientoController } from './movimiento.controller';
import { Movimiento } from './movimiento.entity'; 
import { SaldoModule } from 'src/saldo/saldo/saldo.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Movimiento]),
    SaldoModule,
  ],
  providers: [MovimientoService],
  controllers: [MovimientoController],
  exports: [MovimientoService, TypeOrmModule] 
})
export class MovimientoModule {}