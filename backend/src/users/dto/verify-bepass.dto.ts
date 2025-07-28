import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class VerifyBepassDto {
  @ApiProperty({
    description: 'La clave BePass de 6 dígitos a verificar.',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    pattern: '^[0-9]+$',
  })
  @IsString({ message: 'La clave Be Pass debe ser un texto.' })
  @IsNotEmpty({ message: 'La clave Be Pass no puede estar vacía.' })
  @Length(6, 6, { message: 'La clave Be Pass debe tener exactamente 6 dígitos.' })
  bepass: string;
}
