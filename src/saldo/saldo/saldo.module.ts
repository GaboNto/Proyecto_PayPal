/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaldoService } from './saldo.service';
import { SaldoController } from './saldo.controller';
import { Saldo } from './saldo.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Saldo])
  ],
  providers: [SaldoService],
  controllers: [SaldoController],
  exports: [SaldoService, TypeOrmModule] 
})
export class SaldoModule {}