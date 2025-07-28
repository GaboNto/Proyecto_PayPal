/* eslint-disable prettier/prettier */
import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class CreateCardDto {
  @ApiProperty({
    description: 'El número de la tarjeta (16 dígitos)',
    example: '1234567890123456',
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
  cardNumber: string;

  @ApiProperty({
    description: 'El código de seguridad CVV (3 dígitos)',
    example: '123',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3, { message: 'El CVV debe tener 3 dígitos' })
  cvv: string;

  @ApiProperty({
    description: 'La fecha de expiración de la tarjeta en formato MM/YY',
    example: '12/25',
    pattern: '^(0[1-9]|1[0-2])\\/\\d{2}$',
  })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'La fecha debe tener el formato MM/YY',
  })
  expirationDate: string;
}
