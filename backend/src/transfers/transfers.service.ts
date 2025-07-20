/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Transferencia } from './entities/transferencia.entity';
import { UsuarioExterno } from './entities/usuario-externo.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Transferencia)
    private transferenciasRepository: Repository<Transferencia>,
    @InjectRepository(UsuarioExterno)
    private usuariosExternosRepository: Repository<UsuarioExterno>,
    @InjectRepository(Cuenta)
    private cuentasRepository: Repository<Cuenta>,
    private dataSource: DataSource,
  ) { }

  async transferBetweenOwnAccounts(createDto: CreateInternalTransferDto, userId: number): Promise<{ message: string }> {
    const { cuentaOrigenId, cuentaDestinoId, monto, bepass } = createDto;

    if (cuentaOrigenId === cuentaDestinoId) {
      throw new BadRequestException('La cuenta de origen y destino no pueden ser la misma.');
    }

    // 1. Validar Be Pass
    const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
    if (!user || !user.bepass) {
      throw new UnauthorizedException('El usuario no tiene una clave Be Pass configurada.');
    }
    const isBepassValid = await bcrypt.compare(bepass, user.bepass);
    if (!isBepassValid) {
      throw new UnauthorizedException('La clave Be Pass es incorrecta.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Obtener y validar cuentas
      const cuentaOrigen = await queryRunner.manager.findOne(Cuenta, { where: { id: cuentaOrigenId }, relations: ['usuario'] });
      const cuentaDestino = await queryRunner.manager.findOne(Cuenta, { where: { id: cuentaDestinoId }, relations: ['usuario'] });

      if (!cuentaOrigen || !cuentaDestino) {
        throw new NotFoundException('Una de las cuentas no fue encontrada.');
      }

      // 3. Verificar pertenencia de las cuentas
      if (cuentaOrigen.usuario.id_usuario !== userId || cuentaDestino.usuario.id_usuario !== userId) {
        throw new ForbiddenException('No tienes permiso para operar con estas cuentas.');
      }

      // 4. Verificar saldo suficiente
      if (cuentaOrigen.saldo < monto) {
        throw new BadRequestException('Saldo insuficiente en la cuenta de origen.');
      }

      // 5. Realizar la transferencia
      cuentaOrigen.saldo = Number(cuentaOrigen.saldo) - monto;
      cuentaDestino.saldo = Number(cuentaDestino.saldo) + monto;

      await queryRunner.manager.save(cuentaOrigen);
      await queryRunner.manager.save(cuentaDestino);

      // 6. Guardar el registro de la transferencia
      const transferencia = this.transferenciasRepository.create({
        usuario_id_origen: userId,
        id_usuario_destino: userId, // El mismo usuario
        id_usuario_externo: null,
        monto,
        comision: 0, // Sin comisión para transferencias internas
      });
      await queryRunner.manager.save(transferencia);

      await queryRunner.commitTransaction();
      return { message: 'Transferencia entre tus cuentas realizada con éxito.' };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocurrió un error al procesar la transferencia interna.');
    } finally {
      await queryRunner.release();
    }
  }

  async create(createTransferDto: CreateTransferDto, usuarioOrigenId: number) {
    const { monto, banco_destino, rut_destinatario, nombre_destinatario, tipo_cuenta, numero_cuenta, bepass } = createTransferDto;

    // --- Validación de Be Pass ---
    const usuarioOrigen = await this.usersRepository.findOne({ where: { id_usuario: usuarioOrigenId } });
    if (!usuarioOrigen || !usuarioOrigen.bepass) {
      throw new UnauthorizedException('El usuario no tiene una clave Be Pass configurada.');
    }

    const isBepassValid = await bcrypt.compare(bepass, usuarioOrigen.bepass);
    if (!isBepassValid) {
      throw new UnauthorizedException('La clave Be Pass es incorrecta.');
    }
    // --- Fin de la Validación ---

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Usamos la cuenta seleccionada por el usuario como origen.
      const cuentaOrigen = await queryRunner.manager.findOne(Cuenta, {
        where: { id: createTransferDto.cuentaOrigenId, usuario: { id_usuario: usuarioOrigenId } },
      });

      if (!cuentaOrigen) {
        throw new NotFoundException('No se encontró una cuenta de origen para el usuario.');
      }

      if (banco_destino.toLowerCase() === 'paypal') {
        // Transferencia interna a otro usuario de PayPal
        const usuarioDestino = await queryRunner.manager.findOne(User, { where: { rut: rut_destinatario } });

        if (!usuarioDestino) {
          throw new NotFoundException('Usuario de destino no encontrado en Paypal.');
        }

        // Buscar la cuenta destino por número de cuenta
        const cuentaDestino = await queryRunner.manager.findOne(Cuenta, {
          where: { usuario: { id_usuario: usuarioDestino.id_usuario }, numero_cuenta: numero_cuenta },
        });

        if (!cuentaDestino) {
          throw new NotFoundException('El usuario de destino no tiene una cuenta compatible.');
        }

        if (cuentaOrigen.saldo < monto) {
          throw new BadRequestException('Saldo insuficiente.');
        }

        cuentaOrigen.saldo = Number(cuentaOrigen.saldo) - monto;
        cuentaDestino.saldo = Number(cuentaDestino.saldo) + monto;

        await queryRunner.manager.save(cuentaOrigen);
        await queryRunner.manager.save(cuentaDestino);

        const transferencia = this.transferenciasRepository.create({
          usuario_id_origen: usuarioOrigenId,
          id_usuario_destino: usuarioDestino.id_usuario,
          monto,
          comision: 0,
        });
        await queryRunner.manager.save(transferencia);

      } else {
        // Transferencia externa
        const comision = 300;
        const montoTotal = monto + comision;

        if (cuentaOrigen.saldo < montoTotal) {
          throw new BadRequestException('Saldo insuficiente para cubrir el monto y la comisión.');
        }

        let usuarioExterno = await queryRunner.manager.findOne(UsuarioExterno, { where: { rut: rut_destinatario } });

        if (!usuarioExterno) {
          usuarioExterno = this.usuariosExternosRepository.create({
            rut: rut_destinatario,
            nombre: nombre_destinatario,
            banco: banco_destino,
            tipo_cuenta,
            numero_cuenta,
            saldo: 0 // Saldo inicial
          });
        } else {
          // Actualizar datos del destinatario si ya existe
          usuarioExterno.nombre = nombre_destinatario;
          usuarioExterno.banco = banco_destino;
          usuarioExterno.tipo_cuenta = tipo_cuenta;
          usuarioExterno.numero_cuenta = numero_cuenta;
        }

        // Actualizamos saldos
        cuentaOrigen.saldo = Number(cuentaOrigen.saldo) - montoTotal;
        usuarioExterno.saldo = Number(usuarioExterno.saldo) + monto;

        await queryRunner.manager.save(cuentaOrigen);
        await queryRunner.manager.save(usuarioExterno);

        const transferencia = this.transferenciasRepository.create({
          usuario_id_origen: usuarioOrigenId,
          id_usuario_externo: usuarioExterno.id,
          monto,
          comision,
        });
        await queryRunner.manager.save(transferencia);
      }

      await queryRunner.commitTransaction();
      return { message: 'Transferencia realizada con éxito' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al procesar la transferencia.');
    } finally {
      await queryRunner.release();
    }
  }

  async getUserHistory(userId: number, from?: string, to?: string) {
    const query = this.transferenciasRepository.createQueryBuilder('t')
      .leftJoinAndSelect('t.usuario_origen', 'origen')
      .leftJoinAndSelect('t.usuario_destino', 'destino')
      .leftJoinAndSelect('t.usuario_externo', 'externo')
      .where('t.usuario_id_origen = :userId OR t.id_usuario_destino = :userId', { userId });

    if (from) {
      query.andWhere('t.fecha >= :from', { from });
    }
    if (to) {
      query.andWhere('t.fecha <= :to', { to });
    }
    query.orderBy('t.fecha', 'DESC');
    const transfers = await query.getMany();
    // Mapear la respuesta para el frontend
    return transfers.map(t => {
      // Determinar tipo de transferencia
      let tipo = 'A usuario PayPal';
      if (t.usuario_externo) tipo = 'A cuenta externa';
      else if (t.usuario_id_origen === t.id_usuario_destino) tipo = 'Entre mis cuentas';

      // Origen
      const origen = t.usuario_origen ? {
        rut: t.usuario_origen.rut,
        nombre: t.usuario_origen.nombre + ' ' + t.usuario_origen.apellido,
        id_usuario: t.usuario_origen.id_usuario,
      } : null;
      // Destino
      let destino: any = null;
      if (t.usuario_externo) {
        destino = {
          nombre: t.usuario_externo.nombre,
          rut: t.usuario_externo.rut,
          numero_cuenta: t.usuario_externo.numero_cuenta,
          banco: t.usuario_externo.banco,
          tipo_cuenta: t.usuario_externo.tipo_cuenta,
        };
      } else if (t.usuario_destino) {
        destino = {
          nombre: t.usuario_destino.nombre + ' ' + t.usuario_destino.apellido,
          rut: t.usuario_destino.rut,
          id_usuario: t.usuario_destino.id_usuario,
        };
      }
      return {
        id: t.id,
        fecha: t.fecha,
        monto: t.monto,
        comision: t.comision,
        tipo,
        origen,
        destino,
        hora: t.fecha ? new Date(t.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null,
      };
    });
  }
} 