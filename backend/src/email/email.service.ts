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
        const cambioContraeña = 'http://localhost:3000/forgot-password';
        const fecha = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

        const info = await this.transporter.sendMail({
            from: '"PayPal Clon" <no-reply@paypal-clone.com>',
            to,
            subject: 'Notificación de inicio de sesión en tu cuenta',
            text: `Hola ${nombre}, se ha iniciado sesión en tu cuenta.`,
            html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #0070ba;">Notificación de inicio de sesión</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Se ha detectado un inicio de sesión en tu cuenta de <strong>PayPal Clon</strong>.</p>
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
          &copy; 2025 PayPal Clon. Todos los derechos reservados.
        </footer>
      </div>
    `,
        });

        console.log('Correo enviado:', info.messageId);
    }

    async sendVerificationEmail(to: string, token: string) {
        const verificationUrl = `http://localhost:3000/api/auth/verify-email/${token}`;
        const info = await this.transporter.sendMail({
            from: '"PayPal Clon" <no-reply@paypal-clone.com>',
            to,
            subject: 'Verificación de correo electrónico',
            text: 'Por favor, verifica tu correo electrónico para completar tu registro.',
            html: `<!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e0e0e0; margin-top: 40px;">
                        <tr>
                          <td style="padding: 40px 30px 20px 30px; text-align: center;">
                            <img src='https://www.paypalobjects.com/webstatic/icon/pp258.png' alt='PayPal Logo' width='80' style='margin-bottom: 20px;'>
                            <h2 style="color: #333;">Verifica tu correo electrónico</h2>
                            <p style="color: #555; font-size: 16px;">
                              ¡Gracias por registrarte! Haz clic en el botón para verificar tu dirección de correo electrónico.
                            </p>
                            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070ba; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px;">
                              Verificar correo
                            </a>
                            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                              Si no solicitaste este correo, puedes ignorarlo.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>`
        });
        console.log('Correo de verificación enviado:', info.messageId);
    }
}
