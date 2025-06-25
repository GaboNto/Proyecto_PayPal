import { IsString, IsOptional, IsEmail, Matches } from 'class-validator';

export class UpdateDestinatarioDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.'})
  rut?: string;

  @IsString()
  @IsOptional()
  alias?: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  correo_electronico?: string;

  @IsString()
  @IsOptional()
  banco?: string;

  @IsString()
  @IsOptional()
  tipo_cuenta?: string;

  @IsString()
  @IsOptional()
  numero_cuenta?: string;
} 