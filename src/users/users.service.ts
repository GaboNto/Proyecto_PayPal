/* eslint-disable prettier/prettier */
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { SaldoService } from 'src/saldo/saldo/saldo.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly saldoService: SaldoService,
  ) {}

  // Crear un nuevo usuario
  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hashedPassword });
    const savedUser = await this.repo.save(user);
    await this.saldoService.createInitialSaldo(savedUser, 0); // Saldo inicial de 0
    return savedUser;
  }

  // Buscar un usuario por email
  async findUserByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email }, relations: ['saldo'] });
  }


  async findUserById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id }, relations: ['saldo', 'saldo.movimientos'] }); //  Carga saldo y movimientos
  }
}
