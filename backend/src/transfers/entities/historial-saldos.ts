/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entidad que representa un historial de saldos para una cuenta específica.
 * 
 * Se guarda cada vez que se registra o actualiza el saldo de una cuenta.
 */
@Entity('historial-saldos')
export class HistorialSaldos {
    /**
   * ID único generado automáticamente para cada registro de historial.
   */
    @PrimaryGeneratedColumn()
    id: number;
    /**
   * Número de cuenta bancaria asociado al saldo registrado.
   * Se limita a 30 caracteres.
   */
    @Column({ name: 'numero_cuenta', length: 30 })
    numero_cuenta: string;
    /**
   * Saldo registrado para la cuenta en el momento de la operación.
   * Se almacena como un número decimal con dos decimales.
   */
    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    saldo: number;
   /**
   * Fecha y hora en que se creó el registro.
   * Se genera automáticamente con la marca de tiempo del sistema.
   */
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;
}