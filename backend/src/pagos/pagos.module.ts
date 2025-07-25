import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Cuenta])],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule { }
