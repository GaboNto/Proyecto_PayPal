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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
const destinatario_entity_1 = require("../destinatarios/entities/destinatario.entity");
const swagger_1 = require("@nestjs/swagger");
let User = class User {
    id_usuario;
    nombre;
    apellido;
    email;
    password;
    fecha_nacimiento;
    pais;
    ciudad;
    rut;
    direccion;
    facturacion;
    banco;
    cuentas;
    destinatarios;
    bepass;
    totpSecret;
    emailVerificado;
    twoFAEnabled;
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del usuario',
        example: 1,
        type: 'integer',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id_usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Juan',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellido del usuario',
        example: 'Pérez',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección de correo electrónico del usuario (única)',
        example: 'juan.perez@example.com',
        format: 'email',
        uniqueItems: true,
    }),
    (0, typeorm_1.Column)({ name: 'correo_electronico', unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario (hash)',
        example: 'hashedpassword123',
        writeOnly: true,
    }),
    (0, typeorm_1.Column)({ name: 'contrasena' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de nacimiento del usuario en formato YYYY-MM-DD',
        example: '1990-01-15',
        type: 'string',
        format: 'date',
    }),
    (0, typeorm_1.Column)({ type: 'date', name: 'fecha_nacimiento' }),
    __metadata("design:type", String)
], User.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'País de residencia del usuario',
        example: 'Chile',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "pais", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ciudad de residencia del usuario',
        example: 'Santiago',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "ciudad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RUT (Rol Único Tributario) del usuario (opcional)',
        example: '12345678-9',
        nullable: true,
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección del usuario (opcional)',
        example: 'Calle Falsa 123',
        nullable: true,
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información de facturación del usuario (opcional)',
        example: 'Boleta Electrónica',
        nullable: true,
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "facturacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Banco principal del usuario (por defecto "Paypal")',
        example: 'Paypal',
        maxLength: 50,
    }),
    (0, typeorm_1.Column)({ length: 50, default: 'Paypal' }),
    __metadata("design:type", String)
], User.prototype, "banco", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de cuentas bancarias asociadas al usuario',
        type: () => [cuenta_entity_1.Cuenta],
    }),
    (0, typeorm_1.OneToMany)(() => cuenta_entity_1.Cuenta, (cuenta) => cuenta.usuario),
    __metadata("design:type", Array)
], User.prototype, "cuentas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de destinatarios guardados por el usuario',
        type: () => [destinatario_entity_1.Destinatario],
    }),
    (0, typeorm_1.OneToMany)('Destinatario', (destinatario) => destinatario.propietario),
    __metadata("design:type", Array)
], User.prototype, "destinatarios", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clave BePass del usuario (hash, si está configurada)',
        example: 'hashedbepass',
        nullable: true,
        required: false,
        writeOnly: true,
    }),
    (0, typeorm_1.Column)({ name: 'bepass', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bepass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Secreto TOTP para la autenticación de dos factores (si está configurado)',
        example: 'JBSWY3DPEHPK3PXP',
        nullable: true,
        required: false,
        writeOnly: true,
    }),
    (0, typeorm_1.Column)({ name: 'totp_secret', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "totpSecret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el correo electrónico del usuario ha sido verificado',
        example: false,
        default: false,
    }),
    (0, typeorm_1.Column)({ name: 'email_verificado', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerificado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la autenticación de dos factores (2FA) está habilitada para el usuario',
        example: false,
        default: false,
    }),
    (0, typeorm_1.Column)({ name: '2fa_enabled', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "twoFAEnabled", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('usuarios')
], User);
//# sourceMappingURL=user.entity.js.map