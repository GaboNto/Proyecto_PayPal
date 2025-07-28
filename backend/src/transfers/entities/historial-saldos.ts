/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('historial-saldos')
export class HistorialSaldos {
    @ApiProperty({
        description: 'ID único del registro de historial de saldos',
        example: 1,
        type: 'integer',
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Número de cuenta al que corresponde este registro de saldo',
        example: 'CL1234567890',
        maxLength: 30,
    })
    @Column({ name: 'numero_cuenta', length: 30 })
    numero_cuenta: string;

    @ApiProperty({
        description: 'Saldo registrado en la fecha correspondiente',
        example: 1500000.00,
        type: 'number',
        format: 'float',
    })
    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    saldo: number;

    @ApiProperty({
        description: 'Fecha y hora del registro del saldo',
        example: '2025-07-27T10:00:00.000Z',
        type: 'string',
        format: 'date-time',
    })
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;
}
