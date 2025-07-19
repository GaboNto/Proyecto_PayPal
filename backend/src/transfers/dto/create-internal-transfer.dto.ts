/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInternalTransferDto {
  @ApiProperty({ description: 'ID de la cuenta origen' })
  @IsNumber()
  @IsNotEmpty()
  cuentaOrigenId: number;

  @ApiProperty({ description: 'ID de la cuenta destino',
    example: 2
   } 
  )
  @IsNumber()
  @IsNotEmpty()
  cuentaDestinoId: number;

  @ApiProperty({ description: 'Monto a transferir (positivo)' })
  @IsNumber()
  @IsPositive()
  monto: number;

  
  @ApiProperty({ description: 'Clave BePass del usuario' })
  @IsString()
  @IsNotEmpty()
  bepass: string;
} 