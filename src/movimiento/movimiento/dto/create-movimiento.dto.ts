/* eslint-disable prettier/prettier */
import { IsNumber, IsString, IsNotEmpty, IsPositive, IsIn, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovimientoDto {
  @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  @Type(() => Number) //el valor se transforme a número
  amount: number;

  @IsNotEmpty({ message: 'El tipo de movimiento no puede estar vacío' })
  @IsString({ message: 'El tipo de movimiento debe ser una cadena de texto' })
  @IsIn(['deposito', 'retiro', 'transferencia'], { message: 'Tipo de movimiento no válido' })
  type: string; // 'deposito', 'retiro', 'transferencia'
}