/* eslint-disable prettier/prettier */
import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
export class SetBepassDto {
  @ApiProperty({
    description: 'Nueva clave Be Pass (6 dígitos numéricos)',
    example: '123456',
  })
  @IsString()
  @Length(6, 6, { message: 'La clave Be Pass debe tener exactamente 6 dígitos.' })
  @Matches(/^[0-9]+$/, { message: 'La clave Be Pass solo debe contener números.' })
  newBepass: string;

  @ApiProperty({
    description: 'Confirmación de la nueva clave Be Pass',
    example: '123456',
  })
  @IsString()
  confirmBepass: string;

  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'miContrasenaSegura123',
  })
  @IsString()
  currentPassword: string;

  @ApiPropertyOptional({
    description: 'Indica si se está cambiando la clave (opcional)',
    example: true,
  })
  isChange?: boolean;
} 