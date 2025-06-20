/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity'; 
import { Movimiento } from 'src/movimiento/movimiento/movimiento.entity'; 

@Entity('saldos')
export class Saldo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @OneToOne(() => User, user => user.saldo)
  @JoinColumn()
  user: User;

  @OneToMany(() => Movimiento, movimiento => movimiento.saldo)
  movimientos: Movimiento[];
}