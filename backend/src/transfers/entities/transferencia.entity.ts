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

/**
 * Entidad que representa una transferencia, ya sea interna (entre usuarios del sistema)
 * o externa (hacia un destinatario fuera del sistema).
 */
@Entity('transferencias')
export class Transferencia {
   /**
   * Identificador único de la transferencia.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Usuario emisor (origen) de la transferencia.
   * Relación obligatoria con la entidad User.
   */
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'usuario_id_origen' })
  usuario_origen: User;

    /**
   * ID del usuario emisor.
   * Se guarda como redundancia y FK directa.
   */
  @Column()
  usuario_id_origen: number;

  /**
   * Usuario receptor (si es transferencia interna).
   * Relación opcional con la entidad User.
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_usuario_destino' })
  usuario_destino: User;

  /**
   * ID del usuario receptor.
   */
  @Column({ nullable: true })
  id_usuario_destino: number | null;

  /**
   * Usuario externo receptor (si es transferencia externa).
   * Relación opcional con la entidad UsuarioExterno.
   */
  @ManyToOne(() => UsuarioExterno, { nullable: true })
  @JoinColumn({ name: 'id_usuario_externo' })
  usuario_externo: UsuarioExterno;

    /**
   * ID del usuario externo receptor .
   */
  @Column({ nullable: true })
  id_usuario_externo: number | null;

  /**
   * Número de cuenta de origen usada para la transferencia.
   * Puede ser nulo si no se especifica.
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  cuenta_origen: string | null;

  /**
   * Número de cuenta de destino (usuario interno o externo).
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  cuenta_destino: string | null;
}
  /**
   * Monto de la transferencia en pesos chilenos (CLP).
   */
  @Column('int')
  monto: number;

  
  /**
   * Comisión aplicada a la transferencia (en CLP).
   * Por defecto, 0 si no se aplica comisión.
   */
  @Column('int', { default: 0 })
  comision: number;

  /**
   * Fecha y hora en que se realizó la transferencia.
   * Se genera automáticamente al crear el registro.
   */
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
