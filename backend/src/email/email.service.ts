/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import axios from 'axios';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bankpaypai70@gmail.com',
      pass: 'pbrx octh gnuf hpgi',
    },
  });

  async sendLoginNotification(to: string, nombre: string) {
    const cambioContraeña = 'http://localhost:4200/forgot-password';
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

  async sendPasswordResetEmail(to: string, nombre: string) {
    const resetUrl = `http://paypalbank.sytes.net:3000/`;
    const fechaSolicitud = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

    try {
      const info = await this.transporter.sendMail({
        from: '"PayPal" <no-reply@paypal-clone.com>',
        to,
        subject: 'Restablece tu contraseña de PayPal',
        text: `Hola ${nombre},\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar: ${resetUrl}\n\nEste enlace expirará pronto. Si no solicitaste esto, ignora este correo.\n\nAtentamente,\nEl equipo de PayPal.`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
            <h2 style="color: #0070ba; text-align: center;">Restablece tu Contraseña</h2>
            <p>Hola <strong>${nombre}</strong>,</p>
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
    // La URL de tu aplicación frontend a la que el usuario será dirigido para verificar el correo.
    // Asegúrate de que tu Angular tenga una ruta para /verify-email/:token que maneje esto.
    const verificationUrl = `http://paypalbank.sytes.net:3000/`;
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


}
