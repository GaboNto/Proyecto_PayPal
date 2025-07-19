/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimiento } from './movimiento.entity';
import { CuentasService } from 'src/cuentas/cuentas.service';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto'; 


/**
 * @class MovimientoService
 * @description Servicio encargado de la lógica de gestión de movimientos.
 * Este servicio interactúa directamente con la base de datos para registrar transacciones
 * y actualizar los saldos de las cuentas.
 */
@Injectable()
export class MovimientoService {
    /**
   * @constructor
   * @param movimientoRepository Repositorio de TypeORM para la entidad Movimiento. Permite realizar operaciones CRUD sobre los movimientos.
   * @param cuentaRepository Repositorio de TypeORM para la entidad Cuenta. Permite buscar y actualizar los saldos de las cuentas.
   */
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepository: Repository<Movimiento>,
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
  ) {}

    /**
   * @method createMovimiento
   * @description Registra un nuevo movimiento y actualiza el saldo de la cuenta asociada.
   * Maneja la lógica para depósitos (suma al saldo) y retiros (resta del saldo, con validación de fondos).
   * @param cuentaId El ID de la cuenta a la que se le realiza el movimiento
   * @param createMovimientoDto DTO que contiene el monto y el tipo de movimiento (depósito/retiro).
   * @returns retorna la entidad Movimiento creada
   * @throws NotFoundException Si la cuenta especificada por `cuentaId` no se encuentra.
   * @throws BadRequestException Si el saldo es insuficiente para un retiro o si el tipo de movimiento no es válido.
   */
  async createMovimiento(cuentaId: number, createMovimientoDto: CreateMovimientoDto): Promise<Movimiento> {
    const { amount, type } = createMovimientoDto; 
    // Buscar la cuenta en la base de datos.
    // Se utiliza `findOne` para obtener la cuenta por su ID.
    const cuenta = await this.cuentaRepository.findOne({ where: { id: cuentaId } });
    // Validar si la cuenta existe.
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada.');
    }
    // Crea una nueva instancia de la entidad Movimiento.
    const newMovimiento = this.movimientoRepository.create({ amount, type, cuenta });
    /**
     * Inicializar el saldo actualizado de la cuenta y el monto del movimiento.
     * Se usa `parseFloat` para asegurar que las operaciones matemáticas se realicen con números flotantes
     */
    let updatedAmount = parseFloat(cuenta.saldo.toString());
    const movimientoAmount = parseFloat(amount.toString());

    if (type === 'deposito') {
      updatedAmount += movimientoAmount;
    } else if (type === 'retiro') {
      if (updatedAmount < movimientoAmount) {
        throw new BadRequestException('Saldo insuficiente para el retiro.');
      }
      updatedAmount -= movimientoAmount;
    } else {
      throw new BadRequestException('Tipo de movimiento no válido.');
    }

    await this.cuentaRepository.update(cuenta.id, { saldo: updatedAmount });

    return this.movimientoRepository.save(newMovimiento);
  }
    /**
   * @method findMovimientosByCuentaId
   * @description Recupera todos los movimientos asociados a una cuenta del usuario especifico 
   * @param cuentaId El ID numérico de la cuenta cuyos movimientos se desean obtener.
   * @returns retorna el historial de los movimientos
   */
  async findMovimientosByCuentaId(cuentaId: number): Promise<Movimiento[]> {
    return this.movimientoRepository.find({ where: { cuenta: { id: cuentaId } }, order: { date: 'DESC' } });
  }
}