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
import { ApiProperty } from '@nestjs/swagger';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Identificador único del pago' })
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'idusuario' })
  usuario: User;

  @Column()
  @ApiProperty({ example: 5, description: 'ID del usuario que realiza el pago' })
  idusuario: number;

  @Column('int')
  @ApiProperty({ example: 15000, description: 'Monto del pago en pesos chilenos' })
  monto: number;

  @Column({ type: 'text' })
  @ApiProperty({ example: 'Pago de cuenta de luz', description: 'Descripción del gasto o concepto del pago' })
  descripcion: string;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ example: 'Servicios básicos', description: 'Categoría del gasto, determinada por el clasificador inteligente' })
  categoria: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ example: '2025-07-27T14:00:00.000Z', description: 'Fecha de creación del pago' })
  fecha: Date;
}
