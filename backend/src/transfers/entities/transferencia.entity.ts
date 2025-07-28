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
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('transferencias')
export class Transferencia {
  @ApiProperty({
    description: 'ID único de la transferencia',
    example: 1,
    type: 'integer',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Usuario de origen que realiza la transferencia',
    type: () => User, // Referencia a la entidad User
  })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'usuario_id_origen' })
  usuario_origen: User;

  @ApiProperty({
    description: 'ID del usuario de origen',
    example: 101,
    type: 'integer',
  })
  @Column()
  usuario_id_origen: number;

  @ApiProperty({
    description: 'Usuario de destino (si es una transferencia interna a otro usuario de la plataforma)',
    example: null,
    type: () => User, // Referencia a la entidad User
    nullable: true,
    required: false,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_usuario_destino' })
  usuario_destino: User;

  @ApiProperty({
    description: 'ID del usuario de destino (si es una transferencia interna)',
    example: 102,
    type: 'integer',
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  id_usuario_destino: number | null;

  @ApiProperty({
    description: 'Usuario externo de destino (si es una transferencia externa)',
    example: null,
    type: () => UsuarioExterno, // Referencia a la entidad UsuarioExterno
    nullable: true,
    required: false,
  })
  @ManyToOne(() => UsuarioExterno, { nullable: true })
  @JoinColumn({ name: 'id_usuario_externo' })
  usuario_externo: UsuarioExterno;

  @ApiProperty({
    description: 'ID del usuario externo de destino (si es una transferencia externa)',
    example: 501,
    type: 'integer',
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  id_usuario_externo: number | null;

  @ApiProperty({
    description: 'Número de cuenta de origen de la transferencia',
    example: 'CL1234567890',
    maxLength: 50,
    nullable: true,
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  cuenta_origen: string | null;

  @ApiProperty({
    description: 'Número de cuenta de destino de la transferencia',
    example: 'CL0987654321',
    maxLength: 50,
    nullable: true,
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  cuenta_destino: string | null;

  @ApiProperty({
    description: 'Monto de la transferencia',
    example: 100000,
    type: 'integer',
  })
  @Column('int')
  monto: number;

  @ApiProperty({
    description: 'Comisión aplicada a la transferencia',
    example: 500,
    type: 'integer',
    default: 0,
  })
  @Column('int', { default: 0 })
  comision: number;

  @ApiProperty({
    description: 'Fecha y hora en que se realizó la transferencia',
    example: '2025-07-27T10:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
