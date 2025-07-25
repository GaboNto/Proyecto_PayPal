"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bankpaypai70@gmail.com',
            pass: 'pbrx octh gnuf hpgi',
        },
    });
    async sendLoginNotification(to, nombre) {
        const cambioContraeña = 'http://localhost:4200/forgot-password';
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
    }
    async sendTransferNotification(to, nombre, destinatario, monto, fecha) {
        const fechaStr = fecha.toLocaleString('es-CL', { timeZone: 'America/Santiago' });
        const info = await this.transporter.sendMail({
            from: '"PayPal Clon" <no-reply@paypal-clone.com>',
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
          &copy; 2025 PayPal Clon. Todos los derechos reservados.
        </footer>
      </div>
    `
        });
        console.log('Correo de transferencia enviado:', info.messageId);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map