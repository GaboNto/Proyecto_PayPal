import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches } from 'class-validator';

/**
 * DTO para la creación de un destinatario.
 * Representa los datos necesarios para registrar un contacto al cual enviar transferencias.
 */
export class CreateDestinatarioDto {
  @ApiProperty({
    description: 'Nombre completo del destinatario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  nombre: string;

  @ApiProperty({
    description: 'RUT chileno del destinatario. Formato válido: 12.345.678-9',
    example: '12.345.678-5',
  })
  @IsString()
  @IsNotEmpty({ message: 'El RUT es requerido.' })
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.'})
  rut: string;

  @ApiPropertyOptional({
    description: 'Alias o apodo para identificar al destinatario',
    example: 'Cuenta Ahorro fernando',
  }) 
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del destinatario (opcional)',
    example: 'correo@ejemplo.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  correo_electronico?: string;
  @ApiProperty({
    description: 'Nombre del banco donde el destinatario tiene su cuenta',
    example: 'Banco Estado',
  })
  @IsString()
  @IsNotEmpty({ message: 'El banco es requerido.' })
  banco: string;
  @ApiProperty({
    description: 'Tipo de cuenta bancaria del destinatario',
    example: 'Cuenta Corriente',
  })
  @IsString()
  @IsNotEmpty({ message: 'El tipo de cuenta es requerido.' })
  tipo_cuenta: string;
  @ApiProperty({
    description: 'Número de cuenta del destinatario',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty({ message: 'El número de cuenta es requerido.' })
  numero_cuenta: string;
} 