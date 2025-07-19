/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsEmail, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDestinatarioDto {
  @ApiPropertyOptional({
    description: 'Nombre del destinatario',
    example: 'manuel herrera'
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'RUT chileno del destinatario',
    example: '12.345.678-9'
  })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.'})
  rut?: string;


  @ApiPropertyOptional({
    description: 'Alias del destinatario para identificación rápida',
    example: 'manuel uta'
  })  
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del destinatario',
    example: 'correo@alumnos.uta.cl'
  }) 
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  correo_electronico?: string;

  @ApiPropertyOptional({
    description: 'Banco del destinatario',
    example: 'Banco Estado'
  }) 
  @IsString()
  @IsOptional()
  banco?: string;

  @ApiPropertyOptional({
    description: 'Tipo de cuenta bancaria del destinatario',
    example: 'Cuenta Corriente'
  }) 
  @IsString()
  @IsOptional()
  tipo_cuenta?: string;

  @ApiPropertyOptional({
    description: 'Número de cuenta del destinatario',
    example: '123456789'
  }) 
  @IsString()
  @IsOptional()
  numero_cuenta?: string;
} 