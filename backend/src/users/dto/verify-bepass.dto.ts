/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyBepassDto {
  @ApiProperty({
    description: 'Clave Be Pass a verificar (debe tener exactamente 6 dígitos numéricos)',
    example: '654321',
  }) 
  
  @IsString({ message: 'La clave Be Pass debe ser un texto.' })
  @IsNotEmpty({ message: 'La clave Be Pass no puede estar vacía.' })
  @Length(6, 6, { message: 'La clave Be Pass debe tener exactamente 6 dígitos.' })
  bepass: string;
} 