import { IsString, Length, Matches } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos' })
  cardNumber: string;

  @IsString()
  @Length(3, 3, { message: 'El CVV debe tener 3 dígitos' })
  cvv: string;

  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'La fecha debe tener el formato MM/YY',
  })
  expirationDate: string;
}
