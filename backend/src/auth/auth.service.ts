/* eslint-disable prettier/prettier */
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { Card } from 'src/card/card.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Cuenta)
    private cuentasRepository: Repository<Cuenta>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  // Validar al usuario comparando la contraseña
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Iniciar sesión y generar un JWT
  async login(user: any) {
    const payload = { username: user.email, sub: user.id_usuario };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = this.usersRepository.create({
      ...userData,
        password: hashedPassword,
      banco: 'Paypal',
    });
    
    const savedUser = await this.usersRepository.save(newUser);

    // Crear cuenta para el nuevo usuario
    const numeroDeCuenta = Math.floor(1000000 + Math.random() * 900000000).toString();
    const newCuenta = this.cuentasRepository.create({
      usuario: savedUser,
      numero_cuenta: numeroDeCuenta,
      tipo_cuenta: 'Cuenta Vista',
      saldo: 0,
    });
    await this.cuentasRepository.save(newCuenta);
    
    // --- Creación automática de tarjeta ---
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 4);
    
    const newCard = this.cardRepository.create({
      cardNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      expirationDate: expirationDate.toLocaleDateString('es-ES', { month: '2-digit', year: '2-digit' }),
      cuenta: newCuenta
    });
    await this.cardRepository.save(newCard);
    // --- Fin de creación de tarjeta ---

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = savedUser;
    return result;
  }

  async checkRutExists(rut: string): Promise<{ exists: boolean }> {
    const user = await this.usersRepository.findOne({ where: { rut } });
    return { exists: !!user };
  }
}
