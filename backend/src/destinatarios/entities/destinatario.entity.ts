import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('destinatarios')
export class Destinatario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propietario_id' }) // El usuario que es dueño de este contacto
  propietario: User;

  @Column()
  nombre: string;

  @Column()
  rut: string;

  @Column({ nullable: true })
  alias: string;

  @Column({ name: 'correo_electronico', nullable: true })
  correo_electronico: string;

  @Column()
  banco: string;

  @Column({ name: 'tipo_cuenta' })
  tipo_cuenta: string;

  @Column({ name: 'numero_cuenta' })
  numero_cuenta: string;

  @Column({ default: false })
  es_favorito: boolean;
} 