/* eslint-disable prettier/prettier */
// src/auth/dto/forgot-password.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
  @IsEmail({}, { message: 'El formato del correo electrónico es inválido.' })

  email: string;

  // El campo 'nombre' no es estrictamente necesario para la función de forgot-password,
  // ya que el backend puede obtener el nombre del usuario una vez que el email es validado.
  // Sin embargo, si tu frontend lo envía y quieres validarlo, aquí tienes opciones:
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })

  @IsOptional()
  nombre: string;
}