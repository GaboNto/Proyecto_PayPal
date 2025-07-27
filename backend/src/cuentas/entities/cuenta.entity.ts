/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Movimiento } from '../../movimiento/movimiento/movimiento.entity';
import { Card } from '../../card/card.entity';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('cuentas')
export class Cuenta {
  @ApiProperty({
    description: 'ID único de la cuenta',
    example: 1,
    type: 'integer',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Usuario al que pertenece esta cuenta',
    type: () => User, // Referencia a la entidad User para Swagger
  })
  @ManyToOne(() => User, user => user.cuentas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @ApiProperty({
    description: 'Número de cuenta único',
    example: 'CL123456789012345678901234567890',
    maxLength: 30,
  })
  @Column({ name: 'numero_cuenta', length: 30, unique: true })
  numero_cuenta: string;

  @ApiProperty({
    description: 'Tipo de cuenta (ej. "Cuenta Vista", "Cuenta Corriente", "Cuenta de Ahorro")',
    example: 'Cuenta Corriente',
    maxLength: 50,
    default: 'Cuenta Vista',
    enum: ['Cuenta Vista', 'Cuenta Corriente', 'Cuenta de Ahorro'] // Opcional: si tienes un conjunto fijo de tipos
  })
  @Column({ name: 'tipo_cuenta', length: 50, default: 'Cuenta Vista' })
  tipo_cuenta: string;

  @ApiProperty({
    description: 'Saldo actual de la cuenta',
    example: 1500000.00,
    type: 'number',
    format: 'float',
  })
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  saldo: number;

  @ApiProperty({
    description: 'Fecha y hora de apertura de la cuenta',
    example: '2023-07-27T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @CreateDateColumn({ name: 'fecha_apertura', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_apertura: Date;

  @ApiProperty({
    description: 'Lista de movimientos asociados a esta cuenta',
    type: () => [Movimiento], // Indica que es un array de Movimiento
  })
  @OneToMany(() => Movimiento, movimiento => movimiento.cuenta)
  movimientos: Movimiento[];

  @ApiProperty({
    description: 'Lista de tarjetas asociadas a esta cuenta',
    type: () => [Card], // Indica que es un array de Card
  })
  @OneToMany(() => Card, card => card.cuenta)
  cards: Card[];
}
