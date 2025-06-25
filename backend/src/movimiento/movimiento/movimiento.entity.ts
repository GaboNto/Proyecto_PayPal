import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: string; // 'ingreso' o 'egreso'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Cuenta, cuenta => cuenta.movimientos)
  @JoinColumn({ name: 'cuentaId' })
  cuenta: Cuenta;
}