/* eslint-disable */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
/**
 * Entidad que representa a un destinatario de transferencias externas,
 * vinculado a un usuario (propietario).
 */
@Entity('destinatarios')
export class Destinatario {
  /** Identificador único del destinatario */

  @PrimaryGeneratedColumn()
  id: number;

  
  /**
   * Relación con el usuario propietario del destinatario.
   * Si el usuario se elimina, también se eliminarán sus destinatarios.
   */
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propietario_id' }) // El usuario que es dueño de este contacto
  propietario: User;

  /** Nombre completo del destinatario */
  @Column()
  nombre: string;

  /** RUT del destinatario, debe tener formato chileno */
  @Column()
  rut: string;
 /** Alias opcional para identificar al destinatario fácilmente */
  @Column({ nullable: true })
  alias: string;

  /** Correo electrónico del destinatario */
  @Column({ name: 'correo_electronico', nullable: true })
  correo_electronico: string;
 /** Banco en el cual el destinatario tiene cuenta */
  @Column()
  banco: string;
/** Tipo de cuenta del destinatario (Ej: Corriente, Vista, Ahorro) */
  @Column({ name: 'tipo_cuenta' })
  tipo_cuenta: string;
/** Número de cuenta bancaria del destinatario */
  @Column({ name: 'numero_cuenta' })
  numero_cuenta: string;
/** Marca si el destinatario está como favorito para el usuario */
  @Column({ default: false })
  es_favorito: boolean;
} 