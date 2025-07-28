/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('destinatarios')
export class Destinatario {
  @ApiProperty({
    description: 'ID único del destinatario',
    example: 1,
    type: 'integer',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Usuario propietario de este destinatario',
    type: () => User, // Referencia a la entidad User para Swagger
  })
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propietario_id' }) // El usuario que es dueño de este contacto
  propietario: User;

  @ApiProperty({
    description: 'Nombre del destinatario',
    example: 'María',
  })
  @Column()
  nombre: string;

  @ApiProperty({
    description: 'RUT (Rol Único Tributario) del destinatario',
    example: '98765432-1',
    pattern: '^(\\d{7,8}-[kK0-9])$',
  })
  @Column()
  rut: string;

  @ApiProperty({
    description: 'Alias o apodo para el destinatario (opcional)',
    example: 'Mi hermana',
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  alias: string;

  @ApiProperty({
    description: 'Correo electrónico del destinatario (opcional)',
    example: 'maria.gomez@example.com',
    format: 'email',
    nullable: true,
    required: false,
  })
  @Column({ name: 'correo_electronico', nullable: true })
  correo_electronico: string;

  @ApiProperty({
    description: 'Nombre del banco del destinatario',
    example: 'Banco Estado',
  })
  @Column()
  banco: string;

  @ApiProperty({
    description: 'Tipo de cuenta del destinatario (ej. Cuenta Corriente, Cuenta de Ahorro)',
    example: 'Cuenta Corriente',
  })
  @Column({ name: 'tipo_cuenta' })
  tipo_cuenta: string;

  @ApiProperty({
    description: 'Número de cuenta del destinatario',
    example: '1234567890',
  })
  @Column({ name: 'numero_cuenta' })
  numero_cuenta: string;

  @ApiProperty({
    description: 'Indica si el destinatario es marcado como favorito',
    example: false,
    default: false,
  })
  @Column({ default: false })
  es_favorito: boolean;
}
