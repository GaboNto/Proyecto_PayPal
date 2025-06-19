/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimiento } from './movimiento.entity';
import { SaldoService } from 'src/saldo/saldo/saldo.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto'; 

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    private readonly saldoService: SaldoService,
  ) {}

 
  async createMovimiento(saldoId: number, createMovimientoDto: CreateMovimientoDto): Promise<Movimiento> {
    const { amount, type } = createMovimientoDto; 

    const saldo = await this.saldoService.findSaldoById(saldoId);
    if (!saldo) {
      throw new NotFoundException('Saldo no encontrado.');
    }

    const newMovimiento = this.movimientoRepository.create({ amount, type, saldo });

    let updatedAmount = parseFloat(saldo.amount.toString());
    const movimientoAmount = parseFloat(amount.toString());

    if (type === 'deposito') {
      updatedAmount += movimientoAmount;
    } else if (type === 'retiro') {
      if (updatedAmount < movimientoAmount) {
        throw new Error('Saldo insuficiente para el retiro.');
      }
      updatedAmount -= movimientoAmount;
    } else if (type === 'transferencia') {
        
        throw new Error('La lógica de transferencia ');
    }
    else {
      throw new Error('Tipo de movimiento no válido.');
    }

    await this.saldoService.updateSaldo(saldo.id, updatedAmount);

    return this.movimientoRepository.save(newMovimiento);
  }

  async findMovimientosBySaldoId(saldoId: number): Promise<Movimiento[]> {
    return this.movimientoRepository.find({ where: { saldo: { id: saldoId } }, order: { date: 'DESC' } });
  }
}