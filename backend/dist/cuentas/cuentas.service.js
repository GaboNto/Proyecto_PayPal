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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuentasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cuenta_entity_1 = require("./entities/cuenta.entity");
const user_entity_1 = require("../users/user.entity");
const card_entity_1 = require("../card/card.entity");
let CuentasService = class CuentasService {
    cuentasRepository;
    usersRepository;
    cardRepository;
    constructor(cuentasRepository, usersRepository, cardRepository) {
        this.cuentasRepository = cuentasRepository;
        this.usersRepository = usersRepository;
        this.cardRepository = cardRepository;
    }
    async create(userId, tipo_cuenta) {
        const usuario = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const existingAccount = await this.cuentasRepository.findOne({ where: { usuario: { id_usuario: userId }, tipo_cuenta } });
        if (existingAccount) {
            throw new common_1.BadRequestException(`El usuario ya tiene una ${tipo_cuenta}.`);
        }
        const numeroDeCuenta = Math.floor(1000000 + Math.random() * 900000000).toString();
        const newCuenta = this.cuentasRepository.create({
            usuario,
            numero_cuenta: numeroDeCuenta,
            tipo_cuenta,
            saldo: 0,
        });
        const savedCuenta = await this.cuentasRepository.save(newCuenta);
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 4);
        const newCard = this.cardRepository.create({
            cardNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
            cvv: Math.floor(100 + Math.random() * 900).toString(),
            expirationDate: expirationDate.toLocaleDateString('es-ES', { month: '2-digit', year: '2-digit' }),
            cuenta: savedCuenta,
        });
        await this.cardRepository.save(newCard);
        return savedCuenta;
    }
    async findByUserId(userId) {
        return this.cuentasRepository.find({
            where: { usuario: { id_usuario: userId } },
            relations: ['cards'],
        });
    }
};
exports.CuentasService = CuentasService;
exports.CuentasService = CuentasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cuenta_entity_1.Cuenta)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(card_entity_1.Card)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], CuentasService);
//# sourceMappingURL=cuentas.service.js.map