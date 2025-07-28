/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'La dirección de correo electrónico del usuario para restablecer la contraseña.',
    example: 'usuario@example.com',
    format: 'email',
  })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
  @IsEmail({}, { message: 'El formato del correo electrónico es inválido.' })
  email: string;

  // El campo 'nombre' no es estrictamente necesario para la función de forgot-password,
  // ya que el backend puede obtener el nombre del usuario una vez que el email es validado.
  // Sin embargo, si tu frontend lo envía y quieres validarlo, aquí tienes opciones:
  @ApiProperty({
    description: 'El nombre del usuario (opcional, puede ser usado para personalización del email).',
    example: 'Juan',
    required: false, // Indica que este campo es opcional en la API
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsOptional()
  nombre: string;
}
