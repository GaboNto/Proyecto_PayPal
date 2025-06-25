import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinatariosService } from './destinatarios.service';
import { DestinatariosController } from './destinatarios.controller';
import { Destinatario } from './entities/destinatario.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Destinatario]),
    UsersModule 
  ],
  controllers: [DestinatariosController],
  providers: [DestinatariosService],
})
export class DestinatariosModule {} 