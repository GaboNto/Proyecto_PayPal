/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Card } from '../card/card.entity';
import { Saldo } from 'src/saldo/saldo/saldo.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ name: 'correo_electronico', unique: true })
  email: string;

  @Column({ name: 'contrasena' })
  password: string;

  @Column({ type: 'date', name: 'fecha_nacimiento' })
  fecha_nacimiento: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @OneToOne(() => Saldo, saldo => saldo.user)
  saldo: Saldo;

  @OneToMany(() => Card, card => card.user)
  cards: Card[];
}
