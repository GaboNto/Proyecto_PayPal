import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

/**
 * DTO para realizar una transferencia interna entre cuentas del mismo usuario.
 */
export class CreateInternalTransferDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la cuenta origen desde la que se transferirá el dinero',
  })
  @IsNumber()
  @IsNotEmpty()
  cuentaOrigenId: number;

  @ApiProperty({
    example: 2,
    description: 'ID de la cuenta destino que recibirá el dinero',
  })
  @IsNumber()
  @IsNotEmpty()
  cuentaDestinoId: number;

  @ApiProperty({
    example: 50000,
    description: 'Monto a transferir en pesos chilenos (CLP)',
  }) 
  @IsNumber()
  @IsPositive()
  monto: number;

  @ApiProperty({
    example: 'mySecureBepass123',
    description: 'Clave secundaria Be Pass para autorizar la transferencia',
  })
  @IsString()
  @IsNotEmpty()
  bepass: string;
} 