/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity('historial-saldos')
export class HistorialSaldos {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: 'numero_cuenta', length: 30 })
    numero_cuenta: string;
    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    saldo: number;
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;
}