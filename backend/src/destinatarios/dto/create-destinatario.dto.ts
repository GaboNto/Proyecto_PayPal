/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class CreateDestinatarioDto {
  @ApiProperty({
    description: 'Nombre del destinatario',
    example: 'Carlos',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  nombre: string;

  @ApiProperty({
    description: 'RUT (Rol Único Tributario) del destinatario',
    example: '11222333-4',
    pattern: '^[0-9]{1,2}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9kK]{1}$',
  })
  @IsString()
  @IsNotEmpty({ message: 'El RUT es requerido.' })
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.' })
  rut: string;

  @ApiProperty({
    description: 'Alias o apodo para el destinatario (opcional)',
    example: 'Amigo del trabajo',
    required: false,
  })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiProperty({
    description: 'Correo electrónico del destinatario (opcional)',
    example: 'carlos.rodriguez@example.com',
    format: 'email',
    required: false,
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  correo_electronico?: string;

  @ApiProperty({
    description: 'Nombre del banco del destinatario',
    example: 'Banco de Chile',
  })
  @IsString()
  @IsNotEmpty({ message: 'El banco es requerido.' })
  banco: string;

  @ApiProperty({
    description: 'Tipo de cuenta del destinatario (ej. Cuenta Corriente, Cuenta de Ahorro)',
    example: 'Cuenta Corriente',
  })
  @IsString()
  @IsNotEmpty({ message: 'El tipo de cuenta es requerido.' })
  tipo_cuenta: string;

  @ApiProperty({
    description: 'Número de cuenta del destinatario',
    example: '987654321',
  })
  @IsString()
  @IsNotEmpty({ message: 'El número de cuenta es requerido.' })
  numero_cuenta: string;
}
