/* eslint-disable prettier/prettier */
// src/auth/dto/forgot-password.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
    @IsEmail({}, { message: 'El formato del correo electrónico es inválido.' })

    email: string;

}