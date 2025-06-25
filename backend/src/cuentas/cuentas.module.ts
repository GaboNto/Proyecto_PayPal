import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasService } from './cuentas.service';
import { CuentasController } from './cuentas.controller';
import { Cuenta } from './entities/cuenta.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from '../users/user.entity';
import { Card } from '../card/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuenta, User, Card]), AuthModule],
  controllers: [CuentasController],
  providers: [CuentasService],
  exports: [CuentasService],
})
export class CuentasModule {} 