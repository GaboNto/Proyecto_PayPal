/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateDestinatarioDto {
  @ApiProperty({
    description: 'Nombre completo del destinatario',
    example: 'felipe lopez'
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  nombre: string;

  @ApiProperty({
    description: 'RUT chileno del destinatario',
    example: '12.345.678-9'
  }) 
  @IsString()
  @IsNotEmpty({ message: 'El RUT es requerido.' })
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.'})
  rut: string;

 
  @ApiPropertyOptional({
    description: 'Alias del destinatario',
    example: 'juan uta'
  }) 
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del destinatario (opcional)',
    example: 'correo@gmail.com'
  }) 
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  correo_electronico?: string;

  @ApiProperty({
    description: 'Banco asociado a la cuenta del destinatario',
    example: 'Banco Estado'
  }) 
  @IsString()
  @IsNotEmpty({ message: 'El banco es requerido.' })
  banco: string;

  @ApiProperty({
    description: 'Tipo de cuenta bancaria del destinatario',
    example: 'Cuenta Corriente'
  })
  @IsString()
  @IsNotEmpty({ message: 'El tipo de cuenta es requerido.' })
  tipo_cuenta: string;

  @ApiProperty({
    description: 'Número de cuenta bancaria del destinatario',
    example: '123456789'
  }) 
  @IsString()
  @IsNotEmpty({ message: 'El número de cuenta es requerido.' })
  numero_cuenta: string;
} 