/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePagoDto {
  @ApiProperty({
    example: '1234567890123456',
    description: 'Número de cuenta desde la cual se realiza el pago',
  })
  @IsString()
  @IsNotEmpty()
  numeroCuenta: string;

  @ApiProperty({
    example: 15000,
    description: 'Monto del pago en pesos chilenos',
  })
  @IsInt()
  @IsNotEmpty()
  monto: number;

  @ApiProperty({
    example: 'Pago de Netflix',
    description: 'Descripción del gasto o servicio asociado al pago',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
