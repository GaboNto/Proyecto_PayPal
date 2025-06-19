// src/card/card.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Movimiento } from 'src/movimiento/movimiento/movimiento.entity';


@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 16 })
  cardNumber: string;

  @Column({ length: 3 })
  cvv: string;

  @Column()
  expirationDate: string;
 
  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' }) 
  user: User;
  
  @OneToMany(() => Movimiento, (movimiento) => movimiento.card)
  movimientos: Movimiento[];

}
