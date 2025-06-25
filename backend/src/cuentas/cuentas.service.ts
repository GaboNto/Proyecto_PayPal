import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { User } from '../users/user.entity';
import { Card } from '../card/card.entity';

@Injectable()
export class CuentasService {
  constructor(
    @InjectRepository(Cuenta)
    private cuentasRepository: Repository<Cuenta>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  async create(userId: number, tipo_cuenta: string): Promise<Cuenta> {
    const usuario = await this.usersRepository.findOne({ where: { id_usuario: userId } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const existingAccount = await this.cuentasRepository.findOne({ where: { usuario: { id_usuario: userId }, tipo_cuenta } });
    if (existingAccount) {
      throw new BadRequestException(`El usuario ya tiene una ${tipo_cuenta}.`);
    }

    const numeroDeCuenta = Math.floor(1000000 + Math.random() * 900000000).toString();
    const newCuenta = this.cuentasRepository.create({
      usuario,
      numero_cuenta: numeroDeCuenta,
      tipo_cuenta,
      saldo: 0,
    });
    const savedCuenta = await this.cuentasRepository.save(newCuenta);

    // --- Creación automática de tarjeta ---
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 4);
    const newCard = this.cardRepository.create({
      cardNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      expirationDate: expirationDate.toLocaleDateString('es-ES', { month: '2-digit', year: '2-digit' }),
      cuenta: savedCuenta,
    });
    await this.cardRepository.save(newCard);
    
    return savedCuenta;
  }

  async findByUserId(userId: number): Promise<Cuenta[]> {
    return this.cuentasRepository.find({
      where: { usuario: { id_usuario: userId } },
      relations: ['cards'],
    });
  }
} 