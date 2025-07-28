/* eslint-disable prettier/prettier */
import { IsString, IsOptional, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Nombre del usuario (opcional)',
    example: 'Juan',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @ApiProperty({
    description: 'Apellido del usuario (opcional)',
    example: 'Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  apellido?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario (opcional)',
    example: '1990-01-15',
    required: false,
  })
  @IsOptional()
  @IsString()
  fecha_nacimiento?: string;

  @ApiProperty({
    description: 'Email del usuario (opcional)',
    example: 'juan.perez@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Dirección del usuario (opcional)',
    example: 'Calle Falsa 123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  @ApiProperty({
    description: 'Información de facturación del usuario (opcional)',
    example: 'Boleta Electrónica',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  facturacion?: string;
} 