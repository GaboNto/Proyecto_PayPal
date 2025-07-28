/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimiento } from './movimiento.entity';
import { CuentasService } from 'src/cuentas/cuentas.service';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto'; 

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
  ) {}

  async createMovimiento(cuentaId: number, createMovimientoDto: CreateMovimientoDto): Promise<Movimiento> {
    const { amount, type } = createMovimientoDto; 

    const cuenta = await this.cuentaRepository.findOne({ where: { id: cuentaId } });
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada.');
    }

    const newMovimiento = this.movimientoRepository.create({ amount, type, cuenta });

    let updatedAmount = parseFloat(cuenta.saldo.toString());
    const movimientoAmount = parseFloat(amount.toString());

    if (type === 'deposito') {
      updatedAmount += movimientoAmount;
    } else if (type === 'retiro') {
      if (updatedAmount < movimientoAmount) {
        throw new BadRequestException('Saldo insuficiente para el retiro.');
      }
      updatedAmount -= movimientoAmount;
    } else {
      throw new BadRequestException('Tipo de movimiento no válido.');
    }

    await this.cuentaRepository.update(cuenta.id, { saldo: updatedAmount });

    return this.movimientoRepository.save(newMovimiento);
  }

  async findMovimientosByCuentaId(cuentaId: number): Promise<Movimiento[]> {
    return this.movimientoRepository.find({ where: { cuenta: { id: cuentaId } }, order: { date: 'DESC' } });
  }
}