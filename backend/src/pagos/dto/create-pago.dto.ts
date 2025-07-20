/* eslint-disable prettier/prettier */
import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePagoDto {
  @IsString()
  @IsNotEmpty()
  numeroCuenta: string;

  @IsInt()
  @IsNotEmpty()
  monto: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
