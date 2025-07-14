/* eslint-disable prettier/prettier */
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePagoDto {
  @IsInt()
  @IsNotEmpty()
  idusuario: number;

  @IsInt()
  @IsNotEmpty()
  monto: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
