import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';

/**
 * Representa un movimiento financiero asociado a una cuenta.
 * Puede ser un ingreso (depósito, transferencia entrante) o un egreso (retiro, pago).
 */
@Entity('movimientos')
export class Movimiento {
  /**
   * Identificador único del movimiento.
   */
  @PrimaryGeneratedColumn()
  id: number;
  /**
   * Monto del movimiento. Siempre positivo.
   * El signo dependerá del tipo de operación (`type`).
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
  /**
   * Tipo de movimiento: puede ser `'ingreso'` o `'egreso'`.
   * - `ingreso`: suma al saldo.
   * - `egreso`: resta al saldo.
   */
  @Column()
  type: string; // 'ingreso' o 'egreso'

  /**
   * Fecha y hora en la que se registró el movimiento.
   * Se asigna automáticamente al momento de crearse.
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  /**
   * Cuenta a la que pertenece este movimiento.
   * Relación muchos-a-uno con la entidad Cuenta.
   */
  @ManyToOne(() => Cuenta, cuenta => cuenta.movimientos)
  @JoinColumn({ name: 'cuentaId' })
  cuenta: Cuenta;
}