import { IsString, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  nombre_destinatario: string;

  @IsString()
  @IsNotEmpty()
  rut_destinatario: string;

  @IsString()
  @IsNotEmpty()
  banco_destino: string;

  @IsString()
  @IsNotEmpty()
  tipo_cuenta: string;

  @IsString()
  @IsNotEmpty()
  numero_cuenta: string;

  @IsNumber()
  @Min(1)
  monto: number;

  @IsString()
  @IsNotEmpty()
  bepass: string;
} 