/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Saldo } from 'src/saldo/saldo/saldo.entity'; 
import { Card } from 'src/card/card.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: string; // 'deposito', 'retiro', 'ingreso_tarjeta', 'transferencia'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Saldo, saldo => saldo.movimientos)
  saldo: Saldo;

  //aqui decimos que un movimiento puede o no estar asociado a una tarjeta
  @ManyToOne(() => Card, (card) => card.movimientos, { nullable: true }) // Permite que sea null
  card: Card; 

}