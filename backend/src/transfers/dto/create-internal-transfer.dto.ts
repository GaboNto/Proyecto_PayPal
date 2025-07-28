import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateInternalTransferDto {
  @IsNumber()
  @IsNotEmpty()
  cuentaOrigenId: number;

  @IsNumber()
  @IsNotEmpty()
  cuentaDestinoId: number;

  @IsNumber()
  @IsPositive()
  monto: number;

  @IsString()
  @IsNotEmpty()
  bepass: string;
} 