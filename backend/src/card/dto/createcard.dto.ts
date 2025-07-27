import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    example: '1234567812345678',
    description: 'Número de tarjeta de 16 dígitos numéricos sin espacios ni guiones.',
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
  cardNumber: string;

  @ApiProperty({
    example: '123',
    description: 'Código de seguridad de 3 dígitos (CVV), ubicado en el reverso de la tarjeta.',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3, { message: 'El CVV debe tener 3 dígitos' })
  cvv: string;

  @ApiProperty({
    example: '08/27',
    description: 'Fecha de expiración en formato MM/YY. El mes debe estar entre 01 y 12.',
    pattern: '^(0[1-9]|1[0-2])/\\d{2}$',
  })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'La fecha debe tener el formato MM/YY',
  })
  expirationDate: string;
}
