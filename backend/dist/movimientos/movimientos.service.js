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
exports.MovimientosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const transferencia_entity_1 = require("../transfers/entities/transferencia.entity");
const pago_entity_1 = require("../pagos/entities/pago.entity");
const user_entity_1 = require("../users/user.entity");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
let MovimientosService = class MovimientosService {
    transferenciasRepository;
    pagoRepository;
    userRepository;
    cuentaRepository;
    constructor(transferenciasRepository, pagoRepository, userRepository, cuentaRepository) {
        this.transferenciasRepository = transferenciasRepository;
        this.pagoRepository = pagoRepository;
        this.userRepository = userRepository;
        this.cuentaRepository = cuentaRepository;
    }
    async obtenerNombreUsuario(id) {
        const usuario = await this.userRepository.findOneBy({ id_usuario: id });
        return usuario?.nombre || `usuario #${id}`;
    }
    async obtenerCuenta(cuenta_destino) {
        const cuenta = await this.cuentaRepository.findOneBy({ numero_cuenta: cuenta_destino });
        return cuenta?.tipo_cuenta ?? 'Desconocida';
    }
    async obtenerMovimientosPorUsuario(idUsuario) {
        const pagos = await this.pagoRepository.find({
            where: { idusuario: idUsuario },
            order: { fecha: 'DESC' },
        });
        const transferencias = await this.transferenciasRepository.find({
            where: [
                { usuario_id_origen: idUsuario },
                { id_usuario_destino: idUsuario },
            ],
            order: { fecha: 'DESC' },
        });
        const historial = [];
        for (const pago of pagos) {
            historial.push({
                fecha: pago.fecha,
                descripcion: pago.descripcion,
                categoria: pago.categoria || 'Pago',
                abono: -pago.monto,
            });
        }
        for (const t of transferencias) {
            const esEmisor = t.usuario_id_origen === idUsuario;
            const otroUsuarioId = esEmisor ? t.id_usuario_destino : t.usuario_id_origen;
            let tipoCuenta;
            let nombreOtro;
            if (idUsuario == otroUsuarioId) {
                tipoCuenta = await this.obtenerCuenta(t.cuenta_destino);
                historial.push({
                    fecha: t.fecha,
                    descripcion: `Transferencia a ${tipoCuenta}`,
                    categoria: 'Transferencia',
                    abono: esEmisor ? t.monto : t.monto,
                });
            }
            else {
                nombreOtro = await this.obtenerNombreUsuario(otroUsuarioId);
                historial.push({
                    fecha: t.fecha,
                    descripcion: esEmisor
                        ? `Transferencia a ${nombreOtro}`
                        : `Transferencia de ${nombreOtro}`,
                    categoria: 'Transferencia',
                    abono: esEmisor ? -t.monto : t.monto,
                });
            }
        }
        historial.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        return historial;
    }
};
exports.MovimientosService = MovimientosService;
exports.MovimientosService = MovimientosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(transferencia_entity_1.Transferencia)),
    __param(1, (0, typeorm_2.InjectRepository)(pago_entity_1.Pago)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_2.InjectRepository)(cuenta_entity_1.Cuenta)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], MovimientosService);
//# sourceMappingURL=movimientos.service.js.map