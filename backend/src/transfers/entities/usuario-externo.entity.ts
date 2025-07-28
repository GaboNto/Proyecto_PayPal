/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('usuarios_externos')
export class UsuarioExterno {
  @ApiProperty({
    description: 'ID único del usuario externo',
    example: 1,
    type: 'integer',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre completo del usuario externo',
    example: 'Carlos Gómez',
    maxLength: 100,
  })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({
    description: 'RUT (Rol Único Tributario) del usuario externo',
    example: '12345678-9',
    maxLength: 12,
    uniqueItems: true,
  })
  @Column({ length: 12, unique: true })
  rut: string;

  @ApiProperty({
    description: 'Nombre del banco del usuario externo',
    example: 'Banco de Chile',
    maxLength: 50,
  })
  @Column({ length: 50 })
  banco: string;

  @ApiProperty({
    description: 'Tipo de cuenta del usuario externo (ej. Cuenta Corriente, Cuenta de Ahorro)',
    example: 'Cuenta Corriente',
    maxLength: 50,
  })
  @Column({ name: 'tipo_cuenta', length: 50 })
  tipo_cuenta: string;

  @ApiProperty({
    description: 'Número de cuenta del usuario externo',
    example: '987654321',
    maxLength: 30,
  })
  @Column({ name: 'numero_cuenta', length: 30 })
  numero_cuenta: string;

  @ApiProperty({
    description: 'Saldo de la cuenta del usuario externo (puede ser 0 si no se gestiona saldo aquí)',
    example: 0.00,
    type: 'number',
    format: 'float',
    default: 0,
  })
  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  // eslint-disable-next-line prettier/prettier
  saldo: number;
}
