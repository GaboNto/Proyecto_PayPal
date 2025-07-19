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
exports.TransfersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const transferencia_entity_1 = require("./entities/transferencia.entity");
const usuario_externo_entity_1 = require("./entities/usuario-externo.entity");
const cuenta_entity_1 = require("../cuentas/entities/cuenta.entity");
const typeorm_3 = require("typeorm");
const bcrypt = require("bcrypt");
const historial_saldos_1 = require("./entities/historial-saldos");
let TransfersService = class TransfersService {
    usersRepository;
    transferenciasRepository;
    usuariosExternosRepository;
    cuentasRepository;
    historialRepository;
    dataSource;
    constructor(usersRepository, transferenciasRepository, usuariosExternosRepository, cuentasRepository, historialRepository, dataSource) {
        this.usersRepository = usersRepository;
        this.transferenciasRepository = transferenciasRepository;
        this.usuariosExternosRepository = usuariosExternosRepository;
        this.cuentasRepository = cuentasRepository;
        this.historialRepository = historialRepository;
        this.dataSource = dataSource;
    }
    async transferBetweenOwnAccounts(createDto, userId) {
        const { cuentaOrigenId, cuentaDestinoId, monto, bepass } = createDto;
        if (cuentaOrigenId === cuentaDestinoId) {
            throw new common_1.BadRequestException('La cuenta de origen y destino no pueden ser la misma.');
        }
        const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
        if (!user || !user.bepass) {
            throw new common_1.UnauthorizedException('El usuario no tiene una clave Be Pass configurada.');
        }
        const isBepassValid = await bcrypt.compare(bepass, user.bepass);
        if (!isBepassValid) {
            throw new common_1.UnauthorizedException('La clave Be Pass es incorrecta.');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const cuentaOrigen = await queryRunner.manager.findOne(cuenta_entity_1.Cuenta, { where: { id: cuentaOrigenId }, relations: ['usuario'] });
            const cuentaDestino = await queryRunner.manager.findOne(cuenta_entity_1.Cuenta, { where: { id: cuentaDestinoId }, relations: ['usuario'] });
            if (!cuentaOrigen || !cuentaDestino) {
                throw new common_1.NotFoundException('Una de las cuentas no fue encontrada.');
            }
            if (cuentaOrigen.usuario.id_usuario !== userId || cuentaDestino.usuario.id_usuario !== userId) {
                throw new common_1.ForbiddenException('No tienes permiso para operar con estas cuentas.');
            }
            if (cuentaOrigen.saldo < monto) {
                throw new common_1.BadRequestException('Saldo insuficiente en la cuenta de origen.');
            }
            cuentaOrigen.saldo = Number(cuentaOrigen.saldo) - monto;
            cuentaDestino.saldo = Number(cuentaDestino.saldo) + monto;
            await queryRunner.manager.save(cuentaOrigen);
            await queryRunner.manager.save(cuentaDestino);
            const transferencia = this.transferenciasRepository.create({
                usuario_id_origen: userId,
                id_usuario_destino: userId,
                id_usuario_externo: null,
                cuenta_destino: cuentaDestino.numero_cuenta,
                cuenta_origen: cuentaOrigen.numero_cuenta,
                monto,
                comision: 0,
            });
            await queryRunner.manager.save(transferencia);
            const historialOrigen = this.historialRepository.create({
                numero_cuenta: cuentaOrigen.numero_cuenta,
                saldo: cuentaOrigen.saldo,
            });
            const historialDestino = this.historialRepository.create({
                numero_cuenta: cuentaDestino.numero_cuenta,
                saldo: cuentaDestino.saldo,
            });
            await queryRunner.manager.save([historialOrigen, historialDestino]);
            await queryRunner.commitTransaction();
            return { message: 'Transferencia entre tus cuentas realizada con éxito.' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Ocurrió un error al procesar la transferencia interna.');
        }
        finally {
            await queryRunner.release();
        }
    }
    async create(createTransferDto, usuarioOrigenId) {
        const { monto, banco_destino, rut_destinatario, nombre_destinatario, tipo_cuenta, numero_cuenta, bepass } = createTransferDto;
        const usuarioOrigen = await this.usersRepository.findOne({ where: { id_usuario: usuarioOrigenId } });
        if (!usuarioOrigen || !usuarioOrigen.bepass) {
            throw new common_1.UnauthorizedException('El usuario no tiene una clave Be Pass configurada.');
        }
        const isBepassValid = await bcrypt.compare(bepass, usuarioOrigen.bepass);
        if (!isBepassValid) {
            throw new common_1.UnauthorizedException('La clave Be Pass es incorrecta.');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const cuentaOrigen = await queryRunner.manager.findOne(cuenta_entity_1.Cuenta, {
                where: { id: createTransferDto.cuentaOrigenId, usuario: { id_usuario: usuarioOrigenId } },
            });
            if (!cuentaOrigen) {
                throw new common_1.NotFoundException('No se encontró una cuenta de origen para el usuario.');
            }
            if (banco_destino.toLowerCase() === 'paypal') {
                const usuarioDestino = await queryRunner.manager.findOne(user_entity_1.User, { where: { rut: rut_destinatario } });
                if (!usuarioDestino) {
                    throw new common_1.NotFoundException('Usuario de destino no encontrado en Paypal.');
                }
                const cuentaDestino = await queryRunner.manager.findOne(cuenta_entity_1.Cuenta, {
                    where: { usuario: { id_usuario: usuarioDestino.id_usuario }, numero_cuenta: numero_cuenta },
                });
                if (!cuentaDestino) {
                    throw new common_1.NotFoundException('El usuario de destino no tiene una cuenta compatible.');
                }
                if (cuentaOrigen.saldo < monto) {
                    throw new common_1.BadRequestException('Saldo insuficiente.');
                }
                cuentaOrigen.saldo = Number(cuentaOrigen.saldo) - monto;
                cuentaDestino.saldo = Number(cuentaDestino.saldo) + monto;
                const cuenta_destino = cuentaDestino.numero_cuenta;
                await queryRunner.manager.save(cuentaOrigen);
                await queryRunner.manager.save(cuentaDestino);
                const transferencia = this.transferenciasRepository.create({
                    usuario_id_origen: usuarioOrigenId,
                    id_usuario_destino: usuarioDestino.id_usuario,
                    cuenta_destino,
                    cuenta_origen: cuentaOrigen.numero_cuenta,
                    monto,
                    comision: 0,
                });
                await queryRunner.manager.save(transferencia);
                const historialOrigen = this.historialRepository.create({
                    numero_cuenta: cuentaOrigen.numero_cuenta,
                    saldo: cuentaOrigen.saldo,
                });
                const historialDestino = this.historialRepository.create({
                    numero_cuenta: cuentaDestino.numero_cuenta,
                    saldo: cuentaDestino.saldo,
                });
                await queryRunner.manager.save([historialOrigen, historialDestino]);
            }
            else {
                const comision = 300;
                const montoTotal = monto + comision;
                if (cuentaOrigen.saldo < montoTotal) {
                    throw new common_1.BadRequestException('Saldo insuficiente para cubrir el monto y la comisión.');
                }
                let usuarioExterno = await queryRunner.manager.findOne(usuario_externo_entity_1.UsuarioExterno, { where: { rut: rut_destinatario } });
                if (!usuarioExterno) {
                    usuarioExterno = this.usuariosExternosRepository.create({
                        rut: rut_destinatario,
                        nombre: nombre_destinatario,
                        banco: banco_destino,
                        tipo_cuenta,
                        numero_cuenta,
                        saldo: 0
                    });
                }
                else {
                    usuarioExterno.nombre = nombre_destinatario;
                    usuarioExterno.banco = banco_destino;
                    usuarioExterno.tipo_cuenta = tipo_cuenta;
                    usuarioExterno.numero_cuenta = numero_cuenta;
                }
                cuentaOrigen.saldo = Number(cuentaOrigen.saldo) - montoTotal;
                usuarioExterno.saldo = Number(usuarioExterno.saldo) + monto;
                await queryRunner.manager.save(cuentaOrigen);
                await queryRunner.manager.save(usuarioExterno);
                const transferencia = this.transferenciasRepository.create({
                    usuario_id_origen: usuarioOrigenId,
                    id_usuario_externo: usuarioExterno.id,
                    monto,
                    comision,
                });
                await queryRunner.manager.save(transferencia);
                const historialOrigen = this.historialRepository.create({
                    numero_cuenta: cuentaOrigen.numero_cuenta,
                    saldo: cuentaOrigen.saldo,
                });
                await queryRunner.manager.save([historialOrigen]);
            }
            await queryRunner.commitTransaction();
            return { message: 'Transferencia realizada con éxito' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al procesar la transferencia.');
        }
        finally {
            await queryRunner.release();
        }
    }
    async getUserHistory(userId, from, to) {
        const query = this.transferenciasRepository.createQueryBuilder('t')
            .leftJoinAndSelect('t.usuario_origen', 'origen')
            .leftJoinAndSelect('t.usuario_destino', 'destino')
            .leftJoinAndSelect('t.usuario_externo', 'externo')
            .where('t.usuario_id_origen = :userId OR t.id_usuario_destino = :userId', { userId });
        if (from) {
            query.andWhere('t.fecha >= :from', { from });
        }
        if (to) {
            query.andWhere('t.fecha <= :to', { to });
        }
        query.orderBy('t.fecha', 'DESC');
        const transfers = await query.getMany();
        return transfers.map(t => {
            let tipo = 'A usuario PayPal';
            if (t.usuario_externo)
                tipo = 'A cuenta externa';
            else if (t.usuario_id_origen === t.id_usuario_destino)
                tipo = 'Entre mis cuentas';
            const origen = t.usuario_origen ? {
                rut: t.usuario_origen.rut,
                nombre: t.usuario_origen.nombre + ' ' + t.usuario_origen.apellido,
                id_usuario: t.usuario_origen.id_usuario,
            } : null;
            let destino = null;
            if (t.usuario_externo) {
                destino = {
                    nombre: t.usuario_externo.nombre,
                    rut: t.usuario_externo.rut,
                    numero_cuenta: t.usuario_externo.numero_cuenta,
                    banco: t.usuario_externo.banco,
                    tipo_cuenta: t.usuario_externo.tipo_cuenta,
                };
            }
            else if (t.usuario_destino) {
                destino = {
                    nombre: t.usuario_destino.nombre + ' ' + t.usuario_destino.apellido,
                    rut: t.usuario_destino.rut,
                    id_usuario: t.usuario_destino.id_usuario,
                };
            }
            return {
                id: t.id,
                fecha: t.fecha,
                monto: t.monto,
                comision: t.comision,
                tipo,
                origen,
                destino,
                hora: t.fecha ? new Date(t.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null,
            };
        });
    }
    async obtenerHistorialPorUsuario(usuarioId) {
        const cuentas = await this.cuentasRepository.find({
            where: { usuario: { id_usuario: usuarioId } },
            select: ['numero_cuenta'],
        });
        if (cuentas.length === 0) {
            return [];
        }
        const numerosCuenta = cuentas.map(c => c.numero_cuenta);
        const historial = await this.historialRepository.find({
            where: { numero_cuenta: (0, typeorm_3.In)(numerosCuenta) },
            order: { fecha: 'DESC' },
        });
        console.log(historial);
        return historial;
    }
};
exports.TransfersService = TransfersService;
exports.TransfersService = TransfersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(transferencia_entity_1.Transferencia)),
    __param(2, (0, typeorm_1.InjectRepository)(usuario_externo_entity_1.UsuarioExterno)),
    __param(3, (0, typeorm_1.InjectRepository)(cuenta_entity_1.Cuenta)),
    __param(4, (0, typeorm_1.InjectRepository)(historial_saldos_1.HistorialSaldos)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], TransfersService);
//# sourceMappingURL=transfers.service.js.map