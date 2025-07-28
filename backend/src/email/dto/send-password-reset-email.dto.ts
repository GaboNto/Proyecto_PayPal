/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPasswordResetEmailDto {
    @ApiProperty({
        description: 'La dirección de correo electrónico del destinatario del correo de restablecimiento.',
        example: 'destinatario@example.com',
        format: 'email',
    })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    to: string;

}
