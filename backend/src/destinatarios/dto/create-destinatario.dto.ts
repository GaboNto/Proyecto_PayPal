import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches } from 'class-validator';

export class CreateDestinatarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El RUT es requerido.' })
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-?[0-9kK]{1}$/, { message: 'El formato del RUT no es válido.'})
  rut: string;

  @IsString()
  @IsOptional()
  alias?: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsOptional()
  correo_electronico?: string;

  @IsString()
  @IsNotEmpty({ message: 'El banco es requerido.' })
  banco: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de cuenta es requerido.' })
  tipo_cuenta: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de cuenta es requerido.' })
  numero_cuenta: string;
} 