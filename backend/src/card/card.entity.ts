/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('card')
export class Card {
  @ApiProperty({
    description: 'ID único de la tarjeta (UUID)',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Número de la tarjeta (últimos 4 dígitos visibles en algunas respuestas)',
    example: '1234567890123456',
    minLength: 16,
    maxLength: 16,
  })
  @Column({ length: 16 })
  cardNumber: string;

  @ApiProperty({
    description: 'Código de seguridad CVV de la tarjeta',
    example: '123',
    minLength: 3,
    maxLength: 3,
  })
  @Column({ length: 3 })
  cvv: string;

  @ApiProperty({
    description: 'Fecha de expiración de la tarjeta en formato MM/YY',
    example: '12/25',
    pattern: '^(0[1-9]|1[0-2])\\/\\d{2}$',
  })
  @Column()
  expirationDate: string;

  @ApiProperty({
    description: 'Estado de bloqueo de la tarjeta (true si está bloqueada, false si está activa)',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  is_blocked: boolean;

  // Relación ManyToOne con la entidad Cuenta
  @ApiProperty({
    description: 'La cuenta bancaria asociada a esta tarjeta',
    type: () => Cuenta, // Indica a Swagger el tipo de la relación
  })
  @ManyToOne(() => Cuenta, cuenta => cuenta.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cuenta' }) // Columna en la tabla 'card' que referencia la 'Cuenta'
  cuenta: Cuenta;
}
