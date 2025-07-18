/* eslint-disable prettier/prettier */
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsDateString,
  IsNotEmpty,
  Matches
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MinLength(2)
  @MaxLength(50)
  apellido: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(32, { message: 'La contraseña no debe exceder los 32 caracteres' })
  password: string;

  @IsDateString({}, { message: 'La fecha de nacimiento debe tener formato ISO (YYYY-MM-DD)' })
  fecha_nacimiento: string;

  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  ciudad: string;

  @IsString()
  @IsNotEmpty({ message: 'El país es obligatorio' })
  pais: string;

  @IsString()
  @Matches(/^(\d{7,8}-[kK0-9])$/, {
    message: 'El RUT debe tener el formato correcto, por ejemplo: 12345678-9'
  })
  rut: string;
}
