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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const typeorm_2 = require("typeorm");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
const card_entity_1 = require("../card/card.entity");
const nodemailer = require("nodemailer");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    usersService;
    jwtService;
    usersRepository;
    cuentasRepository;
    cardRepository;
    transporter;
    recoveryTokens = {};
    constructor(usersService, jwtService, usersRepository, cuentasRepository, cardRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
        this.cuentasRepository = cuentasRepository;
        this.cardRepository = cardRepository;
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
    async validateUser(email, pass) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.email, sub: user.id_usuario };
        await this.sendLoginNotification(user.email, user.nombre);
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async register(createUserDto) {
        const { password, ...userData } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.usersRepository.create({
            ...userData,
            password: hashedPassword,
            banco: 'Paypal',
        });
        const savedUser = await this.usersRepository.save(newUser);
        const numeroDeCuenta = Math.floor(1000000 + Math.random() * 900000000).toString();
        const newCuenta = this.cuentasRepository.create({
            usuario: savedUser,
            numero_cuenta: numeroDeCuenta,
            tipo_cuenta: 'Cuenta Vista',
            saldo: 0,
        });
        await this.cuentasRepository.save(newCuenta);
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 4);
        const newCard = this.cardRepository.create({
            cardNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
            cvv: Math.floor(100 + Math.random() * 900).toString(),
            expirationDate: expirationDate.toLocaleDateString('es-ES', { month: '2-digit', year: '2-digit' }),
            cuenta: newCuenta
        });
        await this.cardRepository.save(newCard);
        const { password: _, ...result } = savedUser;
        return result;
    }
    async checkRutExists(rut) {
        const user = await this.usersRepository.findOne({ where: { rut } });
        return { exists: !!user };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user) {
            const token = (0, crypto_1.randomBytes)(32).toString('hex');
            this.recoveryTokens[token] = {
                email,
                expires: Date.now() + 60 * 60 * 1000,
            };
            await this.sendRecoveryEmail(email, token);
        }
        return { message: 'Revisa tu bandeja de entrada. Si la cuenta existe, te llegará un enlace de recuperación.' };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const tokenData = this.recoveryTokens[token];
        if (!tokenData || tokenData.expires < Date.now()) {
            return { message: 'Token inválido o expirado.' };
        }
        const user = await this.usersRepository.findOne({ where: { email: tokenData.email } });
        if (!user) {
            return { message: 'Usuario no encontrado.' };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.save(user);
        delete this.recoveryTokens[token];
        return { message: 'Contraseña restablecida correctamente.' };
    }
    async sendRecoveryEmail(to, token) {
        const info = await this.transporter.sendMail({
            from: 'no-reply@paypal-clone.com',
            to,
            subject: 'Recuperación de contraseña',
            text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://localhost:3000/reset-password?token=${token}`,
            html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><a href="http://localhost:3000/reset-password?token=${token}">Restablecer contraseña</a>`
        });
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    async sendLoginNotification(to, nombre) {
        const info = await this.transporter.sendMail({
            from: 'no-reply@paypal-clone.com',
            to,
            subject: 'Notificación de inicio de sesión',
            text: `Hola ${nombre}, se ha iniciado sesión en tu cuenta.`,
            html: `
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Se ha iniciado sesión en tu cuenta de PayPal Clone.</p>
      <p>Si no fuiste tú, por favor cambia tu contraseña de inmediato.</p>
      <p><small>Fecha y hora: ${new Date().toLocaleString()}</small></p>
    `
        });
        console.log('Login email enviado. Vista previa: %s', nodemailer.getTestMessageUrl(info));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(cuenta_entity_1.Cuenta)),
    __param(4, (0, typeorm_1.InjectRepository)(card_entity_1.Card)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map