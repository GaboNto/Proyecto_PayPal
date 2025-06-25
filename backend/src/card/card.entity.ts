// src/card/card.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 16 })
  cardNumber: string;

  @Column({ length: 3 })
  cvv: string;

  @Column()
  expirationDate: string;

  @Column({ type: 'boolean', default: false })
  is_blocked: boolean;

  @ManyToOne(() => Cuenta, cuenta => cuenta.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cuenta' })
  cuenta: Cuenta;
}
