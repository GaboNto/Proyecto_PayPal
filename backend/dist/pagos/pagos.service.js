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
const axios_1 = require("axios");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pago_entity_1 = require("./entities/pago.entity");
let PagosService = class PagosService {
    pagosRepository;
    constructor(pagosRepository) {
        this.pagosRepository = pagosRepository;
    }
    async create(createPagoDto) {
        try {
            const response = await axios_1.default.post('http://127.0.0.1:8000/predecir', {
                texto: createPagoDto.descripcion,
            });
            const categoria = response.data.categoria;
            const nuevoPago = this.pagosRepository.create({
                idusuario: createPagoDto.idusuario,
                monto: createPagoDto.monto,
                descripcion: createPagoDto.descripcion,
                categoria,
            });
            const pagoGuardado = await this.pagosRepository.save(nuevoPago);
            return {
                message: 'Pago creado y categorizado',
                pago: pagoGuardado,
            };
        }
        catch (error) {
            console.error('Error al conectar con FastAPI:', error.message);
            throw new common_1.InternalServerErrorException('Error al conectar con el servicio de predicción');
        }
    }
    findAll() {
        return this.pagosRepository.find();
    }
    findOne(id) {
        return this.pagosRepository.findOneBy({ id });
    }
    async update(id, updatePagoDto) {
        await this.pagosRepository.update(id, updatePagoDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.pagosRepository.delete(id);
        return { message: `Pago #${id} eliminado` };
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pago_entity_1.Pago)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PagosService);
//# sourceMappingURL=pagos.service.js.map