/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { UsuarioExterno } from './usuario-externo.entity';

@Entity('transferencias')
export class Transferencia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'usuario_id_origen' })
  usuario_origen: User;

  @Column()
  usuario_id_origen: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_usuario_destino' })
  usuario_destino: User;

  @Column({ nullable: true })
  id_usuario_destino: number | null;

  @ManyToOne(() => UsuarioExterno, { nullable: true })
  @JoinColumn({ name: 'id_usuario_externo' })
  usuario_externo: UsuarioExterno;

  @Column({ nullable: true })
  id_usuario_externo: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cuenta_origen: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cuenta_destino: string | null;

  @Column('int')
  monto: number;

  @Column('int', { default: 0 })
  comision: number;


  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
