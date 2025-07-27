import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, Matches } from 'class-validator';
/**
 * DTO para actualizar los datos de un destinatario.
 * Todos los campos son opcionales.
 */

export class UpdateDestinatarioDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del destinatario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'RUT chileno del destinatario. Formato válido: 12.345.678-9',
    example: '12.345.678-5',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.'})
  rut?: string;

  @ApiPropertyOptional({
    description: 'Alias o apodo para identificar al destinatario',
    example: 'Cuenta Ahorro Mamá',
  })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del destinatario',
    example: 'correo@ejemplo.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  correo_electronico?: string;

  @ApiPropertyOptional({
    description: 'Nombre del banco del destinatario',
    example: 'Banco Estado',
  })
  @IsString()
  @IsOptional()
  banco?: string;

  @ApiPropertyOptional({
    description: 'Tipo de cuenta del destinatario',
    example: 'Cuenta Corriente',
  })
  @IsString()
  @IsOptional()
  tipo_cuenta?: string;
  
  @ApiPropertyOptional({
    description: 'Número de cuenta del destinatario',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  numero_cuenta?: string;
} 