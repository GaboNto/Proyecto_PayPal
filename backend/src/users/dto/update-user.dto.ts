import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

/**
 * DTO para actualizar los datos del perfil de usuario.
 * Todas las propiedades son opcionales.
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Juan',
    description: 'Primer nombre del usuario',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: 'Meneses',
    description: 'Apellido del usuario',
  })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiPropertyOptional({
    example: 'Chile',
    description: 'País de residencia del usuario',
  })
  @IsOptional()
  @IsString()
  pais?: string;

  @ApiPropertyOptional({
    example: 'Arica',
    description: 'Ciudad actual del usuario',
  })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiPropertyOptional({
    example: '1998-04-25',
    description: 'Fecha de nacimiento del usuario',
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiPropertyOptional({
    example: 'Calle Falsa 123',
    description: 'Dirección física del usuario',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    example: 'Juan Meneses EIRL',
    description: 'Nombre o razón social para facturación',
  })
  @IsOptional()
  @IsString()
  facturacion?: string;
}
