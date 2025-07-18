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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  // Almacenamiento temporal de tokens: { token: { email, expires } }
  private recoveryTokens: Record<string, { email: string; expires: number }> = {};

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Cuenta)
    private cuentasRepository: Repository<Cuenta>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {
    // Configuración de Ethereal
    nodemailer.createTestAccount().then((testAccount) => {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
  }

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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      // Generar token aleatorio
      const token = randomBytes(32).toString('hex');
      // Guardar token con expiración (ej: 1 hora)
      this.recoveryTokens[token] = {
        email,
        expires: Date.now() + 60 * 60 * 1000,
      };
      // Enviar correo
      await this.sendRecoveryEmail(email, token);
    }
    // Mensaje genérico por seguridad
    return { message: 'Revisa tu bandeja de entrada. Si la cuenta existe, te llegará un enlace de recuperación.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, newPassword } = resetPasswordDto;
    const tokenData = this.recoveryTokens[token];
    if (!tokenData || tokenData.expires < Date.now()) {
      return { message: 'Token inválido o expirado.' };
    }
    const user = await this.usersRepository.findOne({ where: { email: tokenData.email } });
    if (!user) {
      return { message: 'Usuario no encontrado.' };
    }
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
    // Eliminar el token usado
    delete this.recoveryTokens[token];
    return { message: 'Contraseña restablecida correctamente.' };
  }

  private async sendRecoveryEmail(to: string, token: string) {
    const info = await this.transporter.sendMail({
      from: 'no-reply@paypal-clone.com',
      to,
      subject: 'Recuperación de contraseña',
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://localhost:3000/reset-password?token=${token}`,
      html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><a href="http://localhost:3000/reset-password?token=${token}">Restablecer contraseña</a>`
    });
    // Solo para pruebas: mostrar la URL de vista previa de Ethereal
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
