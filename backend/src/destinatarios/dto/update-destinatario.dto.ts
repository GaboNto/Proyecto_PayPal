/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class UpdateDestinatarioDto {
  @ApiProperty({
    description: 'Nuevo nombre del destinatario (opcional para actualización)',
    example: 'Ana',
    required: false,
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiProperty({
    description: 'Nuevo RUT del destinatario (opcional para actualización)',
    example: '99888777-6',
    pattern: '^[0-9]{1,2}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9kK]{1}$',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.' })
  rut?: string;

  @ApiProperty({
    description: 'Nuevo alias o apodo para el destinatario (opcional para actualización)',
    example: 'Hermana de la U',
    required: false,
  })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiProperty({
    description: 'Nuevo correo electrónico del destinatario (opcional para actualización)',
    example: 'ana.lopez@example.com',
    format: 'email',
    required: false,
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  correo_electronico?: string;

  @ApiProperty({
    description: 'Nuevo nombre del banco del destinatario (opcional para actualización)',
    example: 'Banco Santander',
    required: false,
  })
  @IsString()
  @IsOptional()
  banco?: string;

  @ApiProperty({
    description: 'Nuevo tipo de cuenta del destinatario (opcional para actualización)',
    example: 'Cuenta de Ahorro',
    required: false,
  })
  @IsString()
  @IsOptional()
  tipo_cuenta?: string;

  @ApiProperty({
    description: 'Nuevo número de cuenta del destinatario (opcional para actualización)',
    example: '123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  numero_cuenta?: string;
}
