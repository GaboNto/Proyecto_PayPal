
import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { SetBepassDto } from './dto/set-bepass.dto';
import * as bcrypt from 'bcrypt';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  private disable2FATokens: Record<string, { userId: number; expires: number }> = {};

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async updateUserProfile(userId: number, updateUserDto: Partial<User>) {
    const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    // Solo actualiza los campos permitidos
    const camposEditables = ['nombre', 'apellido', 'pais', 'ciudad', 'fecha_nacimiento', 'direccion', 'facturacion'];
    for (const campo of camposEditables) {
      if ((updateUserDto as any)[campo] !== undefined) {
        (user as any)[campo] = (updateUserDto as any)[campo];
      }
    }
    return this.usersRepository.save(user);
  }

  async findUserProfile(userId: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id_usuario: userId },
      relations: ['cuentas'], 
    });
    if (!user) {
      throw new NotFoundException(`User profile with ID ${userId} not found`);
    }
    return user;
  }

  findUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email }, relations: ['cuentas'] });
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id_usuario: id },
      relations: ['cuentas'], // Esto asegura que las cuentas del usuario se carguen
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async verifyBepass(userId: number, verifyBepassDto: VerifyBepassDto): Promise<{ success: boolean }> {
    const { bepass } = verifyBepassDto;
    const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    if (!user.bepass) {
      throw new BadRequestException('El usuario no ha configurado una clave Be Pass.');
    }

    const isBepassValid = await bcrypt.compare(bepass, user.bepass);
    if (!isBepassValid) {
      throw new UnauthorizedException('La clave Be Pass es incorrecta.');
    }

    return { success: true };
  }

  async setBepass(userId: number, setBepassDto: SetBepassDto): Promise<{ message: string }> {
    const { newBepass, confirmBepass, currentPassword } = setBepassDto;

    if (newBepass !== confirmBepass) {
      throw new BadRequestException('Las claves Be Pass no coinciden.');
    }

    const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    // Validación: si el usuario ya tiene Be Pass, solo puede cambiarla, no crearla de nuevo
    if (user.bepass) {
      // Si el frontend está en modo creación, lanzar error
      if (!setBepassDto.isChange) {
        throw new BadRequestException('Ya tienes una clave Be Pass. Solo puedes cambiarla.');
      }
    } else {
      // Si el frontend está en modo cambio, lanzar error
      if (setBepassDto.isChange) {
        throw new BadRequestException('No tienes una clave Be Pass configurada. Debes crearla primero.');
      }
    }

    const hashedBepass = await bcrypt.hash(newBepass, 10);
    user.bepass = hashedBepass;

    await this.usersRepository.save(user);

    return { message: user.bepass ? 'Clave Be Pass actualizada con éxito.' : 'Clave Be Pass creada con éxito.' };
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }

  async requestDisable2FA(userId: number): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.totpSecret) {
      throw new BadRequestException('2FA no está activado para esta cuenta');
    }

    // Generar token único para confirmación
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + (15 * 60 * 1000); // 15 minutos

    this.disable2FATokens[token] = { userId, expires };

    // Enviar correo de confirmación
    await this.sendDisable2FAEmail(user.email, token);

    return { 
      message: 'Se ha enviado un correo de confirmación a tu dirección de email. Revisa tu bandeja de entrada para confirmar la desactivación de 2FA.' 
    };
  }

  async confirmDisable2FA(userId: number, token: string): Promise<{ message: string }> {
    const tokenData = this.disable2FATokens[token];
    
    if (!tokenData) {
      throw new BadRequestException('Token de confirmación inválido');
    }

    if (tokenData.userId !== userId) {
      throw new UnauthorizedException('Token no válido para este usuario');
    }

    if (Date.now() > tokenData.expires) {
      delete this.disable2FATokens[token];
      throw new BadRequestException('Token de confirmación expirado');
    }

    const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Desactivar 2FA
    user.totpSecret = undefined;
    user.twoFAEnabled = false;
    await this.usersRepository.save(user);

    // Limpiar token usado
    delete this.disable2FATokens[token];

    return { message: '2FA ha sido desactivado correctamente' };
  }

  private async sendDisable2FAEmail(email: string, token: string): Promise<void> {
    // Crear cuenta de prueba en Ethereal
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const verificationUrl = `http://localhost:3000/verify-disable-2fa?token=${token}`;

    const mailOptions = {
      from: '"PayPal Security" <security@paypal.com>',
      to: email,
      subject: 'Confirmar desactivación de 2FA - PayPal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #003087; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">PayPal Security</h1>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #003087;">Confirmar desactivación de 2FA</h2>
            <p>Has solicitado desactivar la autenticación en dos pasos (2FA) para tu cuenta PayPal.</p>
            <p><strong>Si no fuiste tú quien solicitó este cambio, ignora este correo.</strong></p>
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>⚠️ Advertencia:</strong> Desactivar 2FA reducirá la seguridad de tu cuenta.
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #0070ba; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Confirmar desactivación de 2FA
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              Este enlace expirará en 15 minutos por seguridad.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="font-size: 12px; color: #999;">
              Si tienes problemas con el enlace, copia y pega esta URL en tu navegador:<br>
              <a href="${verificationUrl}" style="color: #0070ba;">${verificationUrl}</a>
            </p>
          </div>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo de desactivación 2FA enviado a:', email);
      console.log('URL de vista previa:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error enviando correo de desactivación 2FA:', error);
      throw new BadRequestException('Error al enviar el correo de confirmación');
    }
  }
}
