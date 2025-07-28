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
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('pagos')
export class Pago {
  @ApiProperty({
    description: 'ID único del pago',
    example: 1,
    type: 'integer',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Usuario asociado a este pago',
    type: () => User, // Referencia a la entidad User para Swagger
  })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'idusuario' })
  usuario: User;

  @ApiProperty({
    description: 'ID del usuario asociado al pago',
    example: 123,
    type: 'integer',
  })
  @Column()
  idusuario: number;

  @ApiProperty({
    description: 'Monto del pago',
    example: 150.75,
    type: 'number',
    format: 'float',
  })
  @Column('int') // Aunque es 'int', el ejemplo de uso sugiere un decimal. Si es un monto con decimales, TypeORM debería usar 'decimal' o 'numeric'. Mantengo 'int' según tu código, pero tenlo en cuenta.
  monto: number;

  @ApiProperty({
    description: 'Descripción del pago',
    example: 'Compra de víveres en supermercado',
  })
  @Column({ type: 'text' })
  descripcion: string;

  @ApiProperty({
    description: 'Categoría del pago',
    example: 'Alimentos',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  categoria: string;

  @ApiProperty({
    description: 'Fecha y hora en que se realizó el pago',
    example: '2025-07-27T10:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
