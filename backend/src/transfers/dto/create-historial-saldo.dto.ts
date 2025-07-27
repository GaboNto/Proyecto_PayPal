/* eslint-disable prettier/prettier */
// src/historial/dto/create-historial-saldo.dto.ts

import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO para crear un nuevo historial de saldo de cuenta.
 */
export class CreateHistorialSaldoDto {
   @ApiProperty({
    example: '1234567890',
    description: 'Número único de la cuenta bancaria asociada al historial',
  })
    numero_cuenta: string;
   @ApiProperty({
    example: 250000,
    description: 'Saldo actual registrado para la cuenta en pesos chilenos',
  })
    saldo: number;
}
