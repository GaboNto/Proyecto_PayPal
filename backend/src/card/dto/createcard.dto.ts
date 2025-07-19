/* eslint-disable prettier/prettier */
import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    example: '1234567812345678',
    description: 'Número de la tarjeta de crédito o débito (16 dígitos)',
  })
  @IsString()
  @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
  cardNumber: string;

  @ApiProperty({
    example: '123',
    description: 'CVV de la tarjeta (3 dígitos)',
  })
  @IsString()
  @Length(3, 3, { message: 'El CVV debe tener 3 dígitos' })
  cvv: string;

  @ApiProperty({
    example: '12/26',
    description: 'Fecha de expiración en formato MM/YY',
  }) 
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'La fecha debe tener el formato MM/YY',
  })
  expirationDate: string;
}
