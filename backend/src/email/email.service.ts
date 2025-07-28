/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ResetToken } from '../auth/entities/reset-token.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private resetTokenRepository: Repository<ResetToken>,
  ) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bankpaypai70@gmail.com',
      pass: 'pbrx octh gnuf hpgi',
    },
  });

  async sendLoginNotification(to: string, nombre: string) {
    const cambioContraeña = 'http://localhost:3000/forgot-password';
    const fecha = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

    const info = await this.transporter.sendMail({
      from: '"PayPal" <no-reply@paypal-clone.com>',
      to,
      subject: 'Notificación de inicio de sesión en tu cuenta',
      text: `Hola ${nombre}, se ha iniciado sesión en tu cuenta.`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #0070ba;">Notificación de inicio de sesión</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Se ha detectado un inicio de sesión en tu cuenta de <strong>PayPal</strong>.</p>
        <p>Si no fuiste tú, te recomendamos cambiar tu contraseña inmediatamente para proteger tu cuenta.</p>
        <p>
          <a href="${cambioContraeña}" style="display: inline-block; background-color: #0070ba; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px;">
            Recuperar contraseña
          </a>
        </p>
        <hr style="border:none; border-top:1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">
          Fecha y hora del inicio de sesión: <strong>${fecha}</strong>
        </p>
        <p style="font-size: 12px; color: #777;">
          Si tienes alguna duda, contacta con nuestro soporte.
        </p>
        <footer style="text-align: center; font-size: 10px; color: #aaa; margin-top: 30px;">
          &copy; 2025 PayPal. Todos los derechos reservados.
        </footer>
      </div>
    `,
    });

  }

  async sendTransferNotification(to: string, nombre: string, destinatario: string, monto: number, fecha: Date) {
    const fechaStr = fecha.toLocaleString('es-CL', { timeZone: 'America/Santiago' });

    const info = await this.transporter.sendMail({
      from: '"PayPal" <no-reply@paypal-clone.com>',
      to,
      subject: 'Confirmación de transferencia realizada',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #0070ba;">Transferencia realizada</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Te informamos que realizaste una transferencia por <strong>$${monto.toLocaleString('es-CL')}</strong> desde tu cuenta de PayPal a</p> <strong>${destinatario}</strong>
        <p>Fecha y hora: <strong>${fechaStr}</strong></p>
        <hr style="border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #777;">
          Si no reconoces esta transacción, contáctanos inmediatamente.
        </p>
        <footer style="text-align: center; font-size: 10px; color: #aaa; margin-top: 30px;">
          &copy; 2025 PayPal. Todos los derechos reservados.
        </footer>
      </div>
    `
    });

    console.log('Correo de transferencia enviado:', info.messageId);
  }

  async sendPasswordResetEmail(to: string) {
    // Verificar que el usuario existe
    const user = await this.usersRepository.findOne({ where: { email: to } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Generar un token único para el restablecimiento de contraseña
    const token = crypto.randomBytes(32).toString('hex');
    
    // Establecer expiración (1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Almacenar token en la base de datos
    const resetToken = this.resetTokenRepository.create({
      token,
      email: to,
      expiresAt,
      used: false
    });
    await this.resetTokenRepository.save(resetToken);

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    const fechaSolicitud = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

    try {
      const info = await this.transporter.sendMail({
        from: '"PayPal" <no-reply@paypal-clone.com>',
        to,
        subject: 'Restablece tu contraseña de PayPal',
        text: `Hola,\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar: ${resetUrl}\n\nEste enlace expirará pronto. Si no solicitaste esto, ignora este correo.\n\nAtentamente,\nEl equipo de PayPal.`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
            <h2 style="color: #0070ba; text-align: center;">Restablece tu Contraseña</h2>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de PayPal. Si no solicitaste esto, puedes ignorar este correo.</p>
            <p>Para crear una nueva contraseña, por favor haz clic en el botón de abajo. Este enlace es válido por un tiempo limitado por razones de seguridad.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #0070ba; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                Restablecer Contraseña
              </a>
            </p>
            <p>Si tienes problemas con el botón, copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all; font-size: 14px; color: #0070ba;">${resetUrl}</p>
            <hr style="border:none; border-top:1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">
              Fecha de la solicitud: <strong>${fechaSolicitud}</strong>
            </p>
            <p style="font-size: 12px; color: #777;">
              Por favor, no respondas a este correo electrónico.
            </p>
            <footer style="text-align: center; font-size: 10px; color: #aaa; margin-top: 30px;">
              &copy; 2025 PayPal. Todos los derechos reservados.
            </footer>
          </div>
        `,
      });

      console.log('Correo de restablecimiento de contraseña enviado:', info.messageId);
      return info; // Puedes devolver la información del envío si la necesitas
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento de contraseña:', error);
      throw new Error('No se pudo enviar el correo de restablecimiento de contraseña.');
    }
  }

  async sendEmailVerification(to: string, nombre: string) {
    // Generar un token único para la verificación de email
    const token = crypto.randomBytes(32).toString('hex');
    
    // Establecer expiración (24 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Almacenar token en la base de datos
    const verificationToken = this.resetTokenRepository.create({
      token,
      email: to,
      expiresAt,
      used: false
    });
    await this.resetTokenRepository.save(verificationToken);

    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
    const fechaSolicitud = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

    try {
      const info = await this.transporter.sendMail({
        from: '"PayPal" <no-reply@paypal-clone.com>',
        to,
        subject: 'Verifica tu dirección de correo electrónico para PayPal',
        text: `Hola ${nombre},\n\nGracias por registrarte en PayPal. Por favor, verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace: ${verificationUrl}\n\nSi no te registraste en PayPal, ignora este correo.\n\nAtentamente,\nEl equipo de PayPal.`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
            <h2 style="color: #0070ba; text-align: center;">¡Bienvenido a PayPal!</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Gracias por unirte a PayPal. Para activar tu cuenta y comenzar a usar nuestros servicios, por favor verifica tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background-color: #0070ba; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                Verificar Correo Electrónico
              </a>
            </p>
            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all; font-size: 14px; color: #0070ba;">${verificationUrl}</p>
            <p>Este paso nos ayuda a asegurar tu cuenta y a garantizar que recibas todas las notificaciones importantes.</p>
            <p>Si no te registraste en PayPal, por favor ignora este correo.</p>
            <hr style="border:none; border-top:1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">
              Fecha de envío: <strong>${fechaSolicitud}</strong>
            </p>
            <p style="font-size: 12px; color: #777;">
              Por favor, no respondas a este correo electrónico.
            </p>
            <footer style="text-align: center; font-size: 10px; color: #aaa; margin-top: 30px;">
              &copy; 2025 PayPal. Todos los derechos reservados.
            </footer>
          </div>
        `,
      });

      console.log('Correo de verificación de email enviado:', info.messageId);
      return info; // Puedes devolver la información del envío si la necesitas
    } catch (error) {
      console.error('Error al enviar correo de verificación de email:', error);
      throw new Error('No se pudo enviar el correo de verificación.');
    }
  }

  // Métodos para manejar tokens de restablecimiento de contraseña
  async validateResetToken(token: string): Promise<string | null> {
    console.log('ValidateResetToken - Token a validar:', token);
    
    // Buscar token en la base de datos
    const resetToken = await this.resetTokenRepository.findOne({ 
      where: { 
        token,
        used: false
      } 
    });
    console.log('ValidateResetToken - Token encontrado en BD:', resetToken ? 'Sí' : 'No');
    
    if (!resetToken) {
      console.log('ValidateResetToken - Token no encontrado en BD');
      return null;
    }

    // Verificar si el token ha expirado
    const now = new Date();
    console.log('ValidateResetToken - Fecha actual:', now);
    console.log('ValidateResetToken - Fecha expiración:', resetToken.expiresAt);
    
    if (now > resetToken.expiresAt) {
      console.log('ValidateResetToken - Token expirado, marcando como usado');
      resetToken.used = true;
      await this.resetTokenRepository.save(resetToken);
      return null;
    }

    console.log('ValidateResetToken - Token válido, email:', resetToken.email);
    return resetToken.email;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    console.log('ResetPassword - Token recibido:', token);
    
    const email = await this.validateResetToken(token);
    console.log('ResetPassword - Email encontrado:', email);
    
    if (!email) {
      console.log('ResetPassword - Token inválido o expirado');
      return false;
    }

    // Buscar usuario y actualizar contraseña
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('ResetPassword - Usuario encontrado:', user ? 'Sí' : 'No');
    
    if (!user) {
      console.log('ResetPassword - Usuario no encontrado en BD');
      return false;
    }

    try {
      // Hashear nueva contraseña
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      
      await this.usersRepository.save(user);
      console.log('ResetPassword - Contraseña actualizada exitosamente');

      // Marcar token como usado
      const resetToken = await this.resetTokenRepository.findOne({ where: { token } });
      if (resetToken) {
        resetToken.used = true;
        await this.resetTokenRepository.save(resetToken);
        console.log('ResetPassword - Token marcado como usado');
      }

      return true;
    } catch (error) {
      console.error('ResetPassword - Error al actualizar contraseña:', error);
      throw error;
    }
  }

  // Verificar email usando token
  async verifyEmail(token: string): Promise<boolean> {
    console.log('VerifyEmail - Token recibido:', token);
    
    // Buscar token en la base de datos
    const verificationToken = await this.resetTokenRepository.findOne({ 
      where: { 
        token,
        used: false
      } 
    });
    console.log('VerifyEmail - Token encontrado en BD:', verificationToken ? 'Sí' : 'No');
    
    if (!verificationToken) {
      console.log('VerifyEmail - Token no encontrado en BD');
      return false;
    }

    // Verificar si el token ha expirado
    const now = new Date();
    console.log('VerifyEmail - Fecha actual:', now);
    console.log('VerifyEmail - Fecha expiración:', verificationToken.expiresAt);
    
    if (now > verificationToken.expiresAt) {
      console.log('VerifyEmail - Token expirado, marcando como usado');
      verificationToken.used = true;
      await this.resetTokenRepository.save(verificationToken);
      return false;
    }

    try {
      // Buscar usuario y actualizar estado de verificación
      const user = await this.usersRepository.findOne({ where: { email: verificationToken.email } });
      console.log('VerifyEmail - Usuario encontrado:', user ? 'Sí' : 'No');
      
      if (!user) {
        console.log('VerifyEmail - Usuario no encontrado en BD');
        return false;
      }

      // Marcar email como verificado
      user.emailVerificado = true;
      await this.usersRepository.save(user);
      console.log('VerifyEmail - Email marcado como verificado');

      // Marcar token como usado
      verificationToken.used = true;
      await this.resetTokenRepository.save(verificationToken);
      console.log('VerifyEmail - Token marcado como usado');

      return true;
    } catch (error) {
      console.error('VerifyEmail - Error al verificar email:', error);
      throw error;
    }
  }

  // Limpiar tokens expirados
  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    const expiredTokens = await this.resetTokenRepository.find({
      where: {
        expiresAt: { $lt: now } as any,
        used: false
      }
    });
    
    for (const token of expiredTokens) {
      token.used = true;
      await this.resetTokenRepository.save(token);
    }
    
    console.log(`CleanupExpiredTokens - ${expiredTokens.length} tokens expirados marcados como usados`);
  }
}
