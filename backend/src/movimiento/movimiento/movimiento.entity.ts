/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('movimientos')
export class Movimiento {
  @ApiProperty({
    description: 'ID único del movimiento',
    example: 1,
    type: 'integer',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Monto del movimiento',
    example: 1500.50,
    type: 'number',
    format: 'float',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Tipo de movimiento (ej. "ingreso", "egreso")',
    example: 'ingreso',
    enum: ['ingreso', 'egreso'] // Opcional: si tienes un conjunto fijo de tipos
  })
  @Column()
  type: string; // 'ingreso' o 'egreso'

  @ApiProperty({
    description: 'Fecha y hora en que se realizó el movimiento',
    example: '2025-07-27T10:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ApiProperty({
    description: 'La cuenta bancaria asociada a este movimiento',
    type: () => Cuenta, // Indica a Swagger el tipo de la relación
  })
  @ManyToOne(() => Cuenta, cuenta => cuenta.movimientos)
  @JoinColumn({ name: 'cuentaId' }) // Columna en la tabla 'movimientos' que referencia la 'Cuenta'
  cuenta: Cuenta;
}
