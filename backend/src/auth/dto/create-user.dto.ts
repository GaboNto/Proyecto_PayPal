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
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class CreateUserDto {
  @ApiProperty({
    description: 'El nombre del usuario',
    example: 'Juan',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'El apellido del usuario',
    example: 'Pérez',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MinLength(2)
  @MaxLength(50)
  apellido: string;

  @ApiProperty({
    description: 'La dirección de correo electrónico del usuario',
    example: 'juan.perez@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @ApiProperty({
    description: 'La contraseña del usuario (mínimo 8, máximo 32 caracteres)',
    example: 'MiContraseñaSegura123',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(32, { message: 'La contraseña no debe exceder los 32 caracteres' })
  password: string;

  @ApiProperty({
    description: 'La fecha de nacimiento del usuario en formato YYYY-MM-DD',
    example: '1990-01-15',
    format: 'date',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener formato ISO (YYYY-MM-DD)' })
  fecha_nacimiento: string;

  @ApiProperty({
    description: 'La ciudad de residencia del usuario',
    example: 'Santiago',
  })
  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  ciudad: string;

  @ApiProperty({
    description: 'El país de residencia del usuario',
    example: 'Chile',
  })
  @IsString()
  @IsNotEmpty({ message: 'El país es obligatorio' })
  pais: string;

  @ApiProperty({
    description: 'El RUT (Rol Único Tributario) del usuario en formato chileno (ej. 12345678-9)',
    example: '12345678-9',
    pattern: '^(\\d{7,8}-[kK0-9])$',
  })
  @IsString()
  @Matches(/^(\d{7,8}-[kK0-9])$/, {
    message: 'El RUT debe tener el formato correcto, por ejemplo: 12345678-9'
  })
  rut: string;
}
