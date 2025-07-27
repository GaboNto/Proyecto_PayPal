/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transferencia } from 'src/transfers/entities/transferencia.entity';
import { Pago } from 'src/pagos/entities/pago.entity';
import { MovimientoHistorialDto } from './dto/movimiento-historial.dto';
import { User } from 'src/users/user.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';


/**
 * Servicio encargado de consolidar los movimientos (pagos y transferencias)
 * realizados por un usuario, generando un historial financiero.
 */
@Injectable()
export class MovimientosService {


    constructor(
        @InjectRepository(Transferencia)
        private transferenciasRepository: Repository<Transferencia>,
        @InjectRepository(Pago)
        private pagoRepository: Repository<Pago>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Cuenta)
        private cuentaRepository: Repository<Cuenta>
    ) { }

   /**
   * Obtiene el nombre del usuario dado su ID.
   * 
   * @param id ID del usuario
   * @returns Nombre del usuario o texto por defecto si no se encuentra
   */
    private async obtenerNombreUsuario(id: number): Promise<string> {
        const usuario = await this.userRepository.findOneBy({ id_usuario: id });

        return usuario?.nombre || `usuario #${id}`;
    }


  /**
   * Busca el tipo de cuenta a partir del número de cuenta.
   * 
   * @param numeroCuenta Número de cuenta a buscar
   * @returns Tipo de cuenta si existe, o 'Desconocida'
   */
    private async obtenerCuenta(cuenta_destino: string): Promise<string> {
        const cuenta = await this.cuentaRepository.findOneBy({ numero_cuenta: cuenta_destino });
        return cuenta?.tipo_cuenta ?? 'Desconocida';
    }



  /**
   * Devuelve el historial de movimientos (pagos y transferencias) del usuario.
   * 
   * @param idUsuario ID del usuario autenticado
   * @returns Arreglo de objetos con fecha, descripción, categoría y abono
   */
    async obtenerMovimientosPorUsuario(idUsuario: number): Promise<MovimientoHistorialDto[]> {
        // Buscar pagos realizados por el usuario
        const pagos = await this.pagoRepository.find({
            where: { idusuario: idUsuario },
            order: { fecha: 'DESC' },
        });
        // Buscar transferencias hechas o recibidas por el usuario
        const transferencias = await this.transferenciasRepository.find({
            where: [
                { usuario_id_origen: idUsuario },
                { id_usuario_destino: idUsuario },
            ],
            order: { fecha: 'DESC' },
        });

        const historial: MovimientoHistorialDto[] = [];
        // Registrar pagos (siempre son salidas de dinero)
        for (const pago of pagos) {
            historial.push({
                fecha: pago.fecha,
                descripcion: pago.descripcion,
                categoria: pago.categoria || 'Pago',
                abono: -pago.monto,
            });
        }
        // Registrar transferencias
        for (const t of transferencias) {

            const esEmisor = t.usuario_id_origen === idUsuario;
            const otroUsuarioId = esEmisor ? t.id_usuario_destino : t.usuario_id_origen;
            let tipoCuenta;
            let nombreOtro;
            if (idUsuario == otroUsuarioId) {
                // Transferencia entre cuentas propias
                tipoCuenta = await this.obtenerCuenta(t.cuenta_destino!)
                historial.push({
                    fecha: t.fecha,
                    descripcion:
                        `Transferencia a ${tipoCuenta}`,
                    categoria: 'Transferencia',
                    abono: esEmisor ? t.monto : t.monto,
                });

            }
            else {
                // Transferencia a o desde otro usuario
                nombreOtro = await this.obtenerNombreUsuario(otroUsuarioId!)
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
        // Ordenar cronológicamente (más reciente primero)
        historial.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        return historial;
    }





}
