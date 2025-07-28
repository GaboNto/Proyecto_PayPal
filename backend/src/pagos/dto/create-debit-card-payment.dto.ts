/* eslint-disable prettier/prettier */
import { IsString, Length, Matches, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class CreateDebitCardPaymentDto {
    @ApiProperty({
        description: 'El número de cuenta desde la cual se debitará el dinero.',
        example: '9876543210',
    })
    @IsString({ message: 'El número de cuenta debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El número de cuenta es obligatorio.' })
    numeroCuenta: string; // La cuenta desde la cual se debitará el dinero

    @ApiProperty({
        description: 'Monto del pago. Debe ser un número positivo.',
        example: 150.75,
        type: 'number',
        format: 'float',
        minimum: 0.01,
    })
    @IsNumber({}, { message: 'El monto debe ser un número.' })
    @Min(0.01, { message: 'El monto debe ser positivo.' })
    monto: number;

    @ApiProperty({
        description: 'Descripción del pago.',
        example: 'Pago de factura de luz',
    })
    @IsString({ message: 'La descripción debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La descripción es obligatoria.' })
    descripcion: string;

    @ApiProperty({
        description: 'Número de la tarjeta de débito (16 dígitos).',
        example: '1111222233334444',
        minLength: 16,
        maxLength: 16,
    })
    @IsString({ message: 'El número de tarjeta debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El número de tarjeta es obligatorio.' })
    @Length(16, 16, { message: 'El número de tarjeta debe tener 16 dígitos.' })
    // Una validación básica del algoritmo de Luhn podría ir aquí o en el frontend
    // @Matches(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13}|(?:2131|1800|35\d{3})\d{11})$/, { message: 'Número de tarjeta inválido.' })
    cardNumber: string;

    @ApiProperty({
        description: 'Código de seguridad CVV de la tarjeta (3 o 4 dígitos).',
        example: '567',
        minLength: 3,
        maxLength: 4,
    })
    @IsString({ message: 'El CVV debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El CVV es obligatorio.' })
    @Length(3, 4, { message: 'El CVV debe tener 3 o 4 dígitos.' }) // Algunas tarjetas (ej. Amex) tienen CVV de 4 dígitos
    cvv: string;

    @ApiProperty({
        description: 'Fecha de expiración de la tarjeta en formato MM/YY.',
        example: '10/26',
        pattern: '^(0[1-9]|1[0-2])\\/\\d{2}$',
    })
    @IsString({ message: 'La fecha de expiración debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La fecha de expiración es obligatoria.' })
    @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, {
        message: 'La fecha de expiración debe tener el formato MM/YY (ej. 12/25).',
    })
    expirationDate: string;
}
