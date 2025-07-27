/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Entidad que representa a un destinatario externo para transferencias fuera del sistema.
 * 
 * Esta tabla guarda la información bancaria básica del usuario externo.
 */
@Entity('usuarios_externos')
export class UsuarioExterno {
    /**
   * ID único del usuario externo.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nombre completo del destinatario externo.
   */
  @Column({ length: 100 })
  nombre: string;
  /**
   * RUT del destinatario (único), usado para identificación.
   */
  @Column({ length: 12, unique: true })
  rut: string;
  /**
   * Nombre del banco donde tiene cuenta el destinatario.
   */
  @Column({ length: 50 })
  banco: string;
  /**
   * Tipo de cuenta del destinatario (Ej: Corriente, Vista, Ahorro).
   */
  @Column({ name: 'tipo_cuenta', length: 50 })
  tipo_cuenta: string;
  /**
   * Número de cuenta bancaria del destinatario externo.
   */
  @Column({ name: 'numero_cuenta', length: 30 })
  numero_cuenta: string;
  /**
   * Saldo ficticio o referencial usado en algunas operaciones (opcional).
   * Por defecto se establece en 0.
   */
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  // eslint-disable-next-line prettier/prettier
  saldo: number;
} 