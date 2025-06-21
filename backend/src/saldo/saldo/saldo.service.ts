/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saldo } from './saldo.entity'; 
import { User } from 'src/users/user.entity'; 

@Injectable()
export class SaldoService {
  constructor(
    @InjectRepository(Saldo)
    private readonly saldoRepository: Repository<Saldo>,
  ) {}

  async createInitialSaldo(user: User, initialAmount: number): Promise<Saldo> {
    const newSaldo = this.saldoRepository.create({ amount: initialAmount, user: user });
    return this.saldoRepository.save(newSaldo);
  }

  async findSaldoByUserId(userId: number): Promise<Saldo | null> {
    return this.saldoRepository.findOne({ where: { user: { id_usuario: userId } }, relations: ['user', 'movimientos'] });
  }

  async updateSaldo(saldoId: number, newAmount: number): Promise<Saldo | null> {
    await this.saldoRepository.update(saldoId, { amount: newAmount });
    return this.findSaldoById(saldoId); // Devuelve el saldo actualizado
  }

  async findSaldoById(id: number): Promise<Saldo | null> {
    return this.saldoRepository.findOne({ where: { id }, relations: ['user', 'movimientos'] });
  }
}