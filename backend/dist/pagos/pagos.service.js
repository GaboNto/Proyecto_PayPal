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
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pago_entity_1 = require("./entities/pago.entity");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
const axios_1 = require("axios");
const card_entity_1 = require("../card/card.entity");
let PagosService = class PagosService {
    pagosRepository;
    cuentaRepository;
    cardRepository;
    constructor(pagosRepository, cuentaRepository, cardRepository) {
        this.pagosRepository = pagosRepository;
        this.cuentaRepository = cuentaRepository;
        this.cardRepository = cardRepository;
    }
    async create(createPagoDto) {
        const { monto, descripcion, numeroCuenta } = createPagoDto;
        const cuenta = await this.cuentaRepository.findOne({
            where: { numero_cuenta: numeroCuenta },
            relations: ['usuario'],
        });
        if (!cuenta) {
            throw new common_1.NotFoundException('La cuenta no existe');
        }
        if (cuenta.saldo < monto) {
            throw new common_1.BadRequestException('Saldo insuficiente en la cuenta');
        }
        let categoria;
        try {
            const response = await axios_1.default.post('http://127.0.0.1:8000/predecir', {
                texto: descripcion,
            });
            categoria = response.data.categoria;
        }
        catch (error) {
            console.error('Error al conectar con FastAPI:', error.message);
            throw new common_1.InternalServerErrorException('Error al predecir categoría');
        }
        const nuevoPago = this.pagosRepository.create({
            idusuario: cuenta.usuario.id_usuario,
            monto,
            descripcion,
            categoria,
        });
        const pagoGuardado = await this.pagosRepository.save(nuevoPago);
        cuenta.saldo -= monto;
        await this.cuentaRepository.save(cuenta);
        return {
            message: 'Pago creado correctamente',
            pago: pagoGuardado,
            nuevoSaldo: cuenta.saldo,
        };
    }
    async createCreditCardPayment(createCreditCardPaymentDto) {
        const { monto, descripcion, cardNumber, cvv, expirationDate } = createCreditCardPaymentDto;
        console.log(`Simulando validación y autorización de tarjeta: ${cardNumber}, ${expirationDate}, ${cvv}, Monto: ${monto}`);
        const card = await this.cardRepository.findOne({
            where: { cardNumber },
            relations: ['cuenta', 'cuenta.usuario'],
        });
        if (!card) {
            throw new common_1.NotFoundException('Tarjeta no encontrada o no asociada a ninguna cuenta.');
        }
        if (card.is_blocked) {
            throw new common_1.BadRequestException('La tarjeta está bloqueada.');
        }
        if (card.cvv !== cvv) {
            throw new common_1.BadRequestException('CVV incorrecto para esta tarjeta.');
        }
        if (card.expirationDate !== expirationDate) {
            throw new common_1.BadRequestException('Fecha de expiración incorrecta para esta tarjeta.');
        }
        const [storedMonth, storedYear] = card.expirationDate.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (storedYear < currentYear || (storedYear === currentYear && storedMonth < currentMonth)) {
            throw new common_1.BadRequestException('La tarjeta ha expirado.');
        }
        const cuentaAsociada = card.cuenta;
        if (!cuentaAsociada) {
            throw new common_1.InternalServerErrorException('La tarjeta no tiene una cuenta bancaria asociada.');
        }
        if (cuentaAsociada.saldo < monto) {
            throw new common_1.BadRequestException('Saldo insuficiente en la cuenta asociada a la tarjeta.');
        }
        let categoria;
        try {
            const response = await axios_1.default.post('http://127.0.0.1:8000/predecir', {
                texto: descripcion,
            });
            categoria = response.data.categoria;
        }
        catch (error) {
            console.error('Error al conectar con FastAPI para predecir categoría:', error.message);
            throw new common_1.InternalServerErrorException('Error al predecir categoría del pago.');
        }
        const nuevoPago = this.pagosRepository.create({
            idusuario: cuentaAsociada.usuario.id_usuario,
            monto,
            descripcion,
            categoria,
        });
        const pagoGuardado = await this.pagosRepository.save(nuevoPago);
        cuentaAsociada.saldo -= monto;
        await this.cuentaRepository.save(cuentaAsociada);
        return {
            message: 'Pago con tarjeta procesado y saldo de cuenta asociado debitado correctamente.',
            pago: pagoGuardado,
            nuevoSaldo: cuentaAsociada.saldo,
        };
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pago_entity_1.Pago)),
    __param(1, (0, typeorm_1.InjectRepository)(cuenta_entity_1.Cuenta)),
    __param(2, (0, typeorm_1.InjectRepository)(card_entity_1.Card)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PagosService);
//# sourceMappingURL=pagos.service.js.map