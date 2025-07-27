import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';

/**
 * DTO para registrar una transferencia externa hacia un destinatario de otro banco.
 */

export class CreateTransferDto {
  @ApiProperty({
    example: 'Andrea Navia',
    description: 'Nombre completo del destinatario de la transferencia',
  })
  @IsString()
  @IsNotEmpty()
  nombre_destinatario: string;

  @ApiProperty({
    example: '12345678-9',
    description: 'RUT del destinatario (formato chileno)',
  })
  @IsString()
  @IsNotEmpty()
  rut_destinatario: string;

  @ApiProperty({
    example: 'BancoEstado',
    description: 'Nombre del banco de destino',
  })
  @IsString()
  @IsNotEmpty()
  banco_destino: string;

  @ApiProperty({
    example: 'Cuenta Corriente',
    description: 'Tipo de cuenta bancaria del destinatario (Ej: Corriente, Vista, Ahorro)',
  })
  @IsString()
  @IsNotEmpty()
  tipo_cuenta: string;

  @ApiProperty({
    example: '987654321',
    description: 'Número de cuenta bancaria del destinatario',
  })
  @IsString()
  @IsNotEmpty()
  numero_cuenta: string;

  @ApiProperty({
    example: 15000,
    description: 'Monto a transferir en pesos chilenos (CLP). Debe ser mayor a $0.',
  }) 
  @IsNumber()
  @Min(1)
  monto: number;

  @ApiProperty({
    example: 'claveSecundaria123',
    description: 'Clave secundaria Be Pass del usuario emisor para autorizar la transferencia',
  })
  @IsString()
  @IsNotEmpty()
  bepass: string;

  @ApiProperty({
    example: 1,
    description: 'ID de la cuenta origen del usuario que envía el dinero',
  })
  @IsNumber()
  @IsNotEmpty()
  cuentaOrigenId: number;
} 