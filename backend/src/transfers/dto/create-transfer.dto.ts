/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({
    description: 'Nombre completo del destinatario',
    example: 'mike tyson'
  })
  @IsString()
  @IsNotEmpty()
  nombre_destinatario: string;

  @ApiProperty({
    description: 'RUT del destinatario (formato chileno)',
    example: '12.345.678-9'
  })  
  @IsString()
  @IsNotEmpty()
  rut_destinatario: string;

  @ApiProperty({
    description: 'Banco destino',
    example: 'paypal'
  })
  @IsString()
  @IsNotEmpty()
  banco_destino: string;

  
  @ApiProperty({
    description: 'Tipo de cuenta del destinatario',
    example: 'Cuenta Corriente, Cuenta Vista'
  })
  @IsString()
  @IsNotEmpty()
  tipo_cuenta: string;

  @ApiProperty({
    description: 'Número de cuenta del destinatario',
    example: '12'
  })
  @IsString()
  @IsNotEmpty()
  numero_cuenta: string;

  @ApiProperty({
    description: 'Monto a transferir (debe ser mayor que 0)',
    example: 1500
  })
  @IsNumber()
  @Min(1)
  monto: number;

  
  @ApiProperty({
    description: 'Clave BePass del usuario (6 dígitos)',
    example: '654321'
  })
  @IsString()
  @IsNotEmpty()
  bepass: string;

  @ApiProperty({
    description: 'ID de la cuenta desde la que se realiza la transferencia',
    example: 42
  })
  @IsNumber()
  @IsNotEmpty()
  cuentaOrigenId: number;
} 