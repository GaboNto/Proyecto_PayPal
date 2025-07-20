"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
let UsersService = class UsersService {
    usersRepository;
    disable2FATokens = {};
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async updateUserProfile(userId, updateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const camposEditables = ['nombre', 'apellido', 'pais', 'ciudad', 'fecha_nacimiento', 'direccion', 'facturacion'];
        for (const campo of camposEditables) {
            if (updateUserDto[campo] !== undefined) {
                user[campo] = updateUserDto[campo];
            }
        }
        return this.usersRepository.save(user);
    }
    async findUserProfile(userId) {
        const user = await this.usersRepository.findOne({
            where: { id_usuario: userId },
            relations: ['cuentas'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User profile with ID ${userId} not found`);
        }
        return user;
    }
    findUserByEmail(email) {
        return this.usersRepository.findOne({ where: { email }, relations: ['cuentas'] });
    }
    async create(createUserDto) {
        const newUser = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(newUser);
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({
            where: { id_usuario: id },
            relations: ['cuentas'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async verifyBepass(userId, verifyBepassDto) {
        const { bepass } = verifyBepassDto;
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        if (!user.bepass) {
            throw new common_1.BadRequestException('El usuario no ha configurado una clave Be Pass.');
        }
        const isBepassValid = await bcrypt.compare(bepass, user.bepass);
        if (!isBepassValid) {
            throw new common_1.UnauthorizedException('La clave Be Pass es incorrecta.');
        }
        return { success: true };
    }
    async setBepass(userId, setBepassDto) {
        const { newBepass, confirmBepass, currentPassword } = setBepassDto;
        if (newBepass !== confirmBepass) {
            throw new common_1.BadRequestException('Las claves Be Pass no coinciden.');
        }
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado.');
        }
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            throw new common_1.UnauthorizedException('La contraseña actual es incorrecta.');
        }
        if (user.bepass) {
            if (!setBepassDto.isChange) {
                throw new common_1.BadRequestException('Ya tienes una clave Be Pass. Solo puedes cambiarla.');
            }
        }
        else {
            if (setBepassDto.isChange) {
                throw new common_1.BadRequestException('No tienes una clave Be Pass configurada. Debes crearla primero.');
            }
        }
        const hashedBepass = await bcrypt.hash(newBepass, 10);
        user.bepass = hashedBepass;
        await this.usersRepository.save(user);
        return { message: user.bepass ? 'Clave Be Pass actualizada con éxito.' : 'Clave Be Pass creada con éxito.' };
    }
    async save(user) {
        return this.usersRepository.save(user);
    }
    async requestDisable2FA(userId) {
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (!user.totpSecret) {
            throw new common_1.BadRequestException('2FA no está activado para esta cuenta');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + (15 * 60 * 1000);
        this.disable2FATokens[token] = { userId, expires };
        await this.sendDisable2FAEmail(user.email, token);
        return {
            message: 'Se ha enviado un correo de confirmación a tu dirección de email. Revisa tu bandeja de entrada para confirmar la desactivación de 2FA.'
        };
    }
    async confirmDisable2FA(userId, token) {
        const tokenData = this.disable2FATokens[token];
        if (!tokenData) {
            throw new common_1.BadRequestException('Token de confirmación inválido');
        }
        if (tokenData.userId !== userId) {
            throw new common_1.UnauthorizedException('Token no válido para este usuario');
        }
        if (Date.now() > tokenData.expires) {
            delete this.disable2FATokens[token];
            throw new common_1.BadRequestException('Token de confirmación expirado');
        }
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        user.totpSecret = undefined;
        user.twoFAEnabled = false;
        await this.usersRepository.save(user);
        delete this.disable2FATokens[token];
        return { message: '2FA ha sido desactivado correctamente' };
    }
    async sendDisable2FAEmail(email, token) {
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
        }
        catch (error) {
            console.error('Error enviando correo de desactivación 2FA:', error);
            throw new common_1.BadRequestException('Error al enviar el correo de confirmación');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map