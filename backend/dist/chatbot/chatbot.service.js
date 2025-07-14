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
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("axios");
const pago_entity_1 = require("../pagos/entities/pago.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
let ChatbotService = class ChatbotService {
    pagoRepo;
    userRepo;
    cuentasRepo;
    constructor(pagoRepo, userRepo, cuentasRepo) {
        this.pagoRepo = pagoRepo;
        this.userRepo = userRepo;
        this.cuentasRepo = cuentasRepo;
    }
    API_KEY = 'AIzaSyBc3sUrI2LB5458o0qOQwluHKP1O4dU5HY';
    MODEL = 'gemini-2.0-flash-lite';
    API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL}:generateContent?key=${this.API_KEY}`;
    async enviarMensaje(prompt) {
        try {
            const response = await axios_1.default.post(this.API_URL, {
                contents: [{ parts: [{ text: prompt }] }],
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const output = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
            return output || 'Sin respuesta del modelo.';
        }
        catch (error) {
            console.error('Error al usar Gemini:', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException('Error al comunicarse con Gemini');
        }
    }
    async getPagos(userId) {
        const pagos = await this.pagoRepo.find({
            where: { idusuario: Number(userId) }
        });
        if (!pagos.length)
            return 'No hay pagos registrados.';
        const lista = pagos.map(p => `Descripción: ${p.descripcion}, Monto: $${p.monto}, Fecha: ${p.fecha.toISOString().split('T')[0]}, Categoría: ${p.categoria}`).join('\n');
        return `Historial de pagos del usuario:\n${lista}`;
    }
    async obtenerCuentasPorUsuario(id_usuario) {
        return this.cuentasRepo.find({
            where: {
                usuario: { id_usuario },
            },
        });
    }
    limpiarCuentas(cuentas) {
        return cuentas.map(cuenta => {
            const { movimientos, cards, usuario, ...restCuenta } = cuenta;
            const { password, bepass, totpSecret, cuentas, destinatarios, ...restUsuario } = usuario;
            return {
                ...restCuenta,
                usuario: restUsuario,
            };
        });
    }
    formatearCuentas(cuentas) {
        return cuentas.map(cuenta => {
            const { usuario, movimientos, cards, ...restCuenta } = cuenta;
            const { password, bepass, totpSecret, cuentas, destinatarios, ...restUsuario } = usuario || {};
            return `Número de cuenta: ${restCuenta.numero_cuenta}, Tipo: ${restCuenta.tipo_cuenta}, Saldo: $${restCuenta.saldo}, Usuario: ${restUsuario?.nombre} ${restUsuario?.apellido}, Email: ${restUsuario?.email}`;
        }).join('\n');
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pago_entity_1.Pago)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(cuenta_entity_1.Cuenta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map