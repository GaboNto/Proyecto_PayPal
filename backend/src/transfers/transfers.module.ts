import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { Transferencia } from './entities/transferencia.entity';
import { UsuarioExterno } from './entities/usuario-externo.entity';
import { User } from '../users/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transferencia, UsuarioExterno, User, Cuenta]),
    AuthModule,
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {} 