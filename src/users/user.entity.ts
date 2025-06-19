/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Card } from '../card/card.entity';
import { Saldo } from 'src/saldo/saldo/saldo.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  //card: any;
  
  @OneToOne(() => Saldo, saldo => saldo.user)
  @JoinColumn() 
  saldo: Saldo;
  
  // Define the relationship with the Card entity if needed
  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];
  

}
