/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Nombre del usuario. Debe tener entre 2 y 50 caracteres.',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario. Debe tener entre 2 y 50 caracteres.',
    example: 'Pérez',
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MinLength(2)
  @MaxLength(50)
  apellido: string;

  @ApiProperty({
    description: 'Correo electrónico válido del usuario.',
    example: 'juan.perez@example.com',
  })
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario. Mínimo 8 y máximo 32 caracteres.',
    example: 'MiContraseñaSegura123',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(32, { message: 'La contraseña no debe exceder los 32 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Fecha de nacimiento en formato ISO (YYYY-MM-DD).',
    example: '1998-05-12',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener formato ISO (YYYY-MM-DD)' })
  fecha_nacimiento: string;

  @ApiProperty({
    description: 'Ciudad de residencia del usuario.',
    example: 'Santiago',
  })
  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  ciudad: string;

  @ApiProperty({
    description: 'País de residencia del usuario.',
    example: 'Chile',
  })
  @IsString()
  @IsNotEmpty({ message: 'El país es obligatorio' })
  pais: string;

  @ApiProperty({
    description: 'RUT chileno del usuario en formato 12345678-9 o similar.',
    example: '12345678-9',
  })
  @IsString()
  @Matches(/^(\d{7,8}-[kK0-9])$/, {
    message: 'El RUT debe tener el formato correcto, por ejemplo: 12345678-9'
  })
  rut: string;
}
