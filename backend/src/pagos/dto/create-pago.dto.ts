/* eslint-disable prettier/prettier */
import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class CreatePagoDto {
  @ApiProperty({
    description: 'El número de cuenta desde la cual se realizará el pago.',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  numeroCuenta: string;

  @ApiProperty({
    description: 'El monto del pago. Debe ser un número entero.',
    example: 10000,
    type: 'integer',
  })
  @IsInt()
  @IsNotEmpty()
  monto: number;

  @ApiProperty({
    description: 'Una descripción del pago.',
    example: 'Pago de arriendo mensual',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
