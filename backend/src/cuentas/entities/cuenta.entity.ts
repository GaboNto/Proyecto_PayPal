/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Movimiento } from '../../movimiento/movimiento/movimiento.entity';
import { Card } from '../../card/card.entity';


/**
 * Representa una cuenta bancaria asociada a un usuario.
 * Puede tener múltiples movimientos y tarjetas asociadas.
 */
@Entity('cuentas')
export class Cuenta {
  /**
   * Identificador único de la cuenta.
   */
  @PrimaryGeneratedColumn()
  id: number;

    /**
   * Usuario propietario de la cuenta.
   */
  @ManyToOne(() => User, user => user.cuentas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column({ name: 'numero_cuenta', length: 30, unique: true })
  numero_cuenta: string;

  @Column({ name: 'tipo_cuenta', length: 50, default: 'Cuenta Vista' })
  tipo_cuenta: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  saldo: number;

  @CreateDateColumn({ name: 'fecha_apertura', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_apertura: Date;

  @OneToMany(() => Movimiento, movimiento => movimiento.cuenta)
  movimientos: Movimiento[];

  @OneToMany(() => Card, card => card.cuenta)
  cards: Card[];
} 