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
    banco;
    cuentas;
    destinatarios;
    bepass;
    totpSecret;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id_usuario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "apellido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correo_electronico', unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contrasena' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'fecha_nacimiento' }),
    __metadata("design:type", String)
], User.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "pais", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "rut", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'Paypal' }),
    __metadata("design:type", String)
], User.prototype, "banco", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuenta_entity_1.Cuenta, (cuenta) => cuenta.usuario),
    __metadata("design:type", Array)
], User.prototype, "cuentas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Destinatario', (destinatario) => destinatario.propietario),
    __metadata("design:type", Array)
], User.prototype, "destinatarios", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bepass', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bepass", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'totp_secret', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "totpSecret", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('usuarios')
], User);
//# sourceMappingURL=user.entity.js.map