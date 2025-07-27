/* eslint-disable prettier/prettier */
import { IsString, Length, Matches, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class SetBepassDto {
  @ApiProperty({
    description: 'La nueva clave BePass de 6 dígitos (solo números).',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    pattern: '^[0-9]+$',
  })
  @IsString()
  @Length(6, 6, { message: 'La clave Be Pass debe tener exactamente 6 dígitos.' })
  @Matches(/^[0-9]+$/, { message: 'La clave Be Pass solo debe contener números.' })
  newBepass: string;

  @ApiProperty({
    description: 'Confirmación de la nueva clave BePass (debe coincidir con newBepass).',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    pattern: '^[0-9]+$',
  })
  @IsString()
  confirmBepass: string;

  @ApiProperty({
    description: 'La contraseña actual del usuario para confirmar el cambio.',
    example: 'MiContraseñaActual123',
    writeOnly: true, // No se muestra en las respuestas de la API
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'Indica si es un cambio de BePass existente (opcional).',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isChange?: boolean;
}
