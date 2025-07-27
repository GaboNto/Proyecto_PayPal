/* eslint-disable prettier/prettier */
// src/movimientos/dto/movimiento-historial.dto.ts

import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO que representa un movimiento financiero en el historial del usuario.
 */
export class MovimientoHistorialDto {
    @ApiProperty({
    description: 'Fecha en que se registró el movimiento',
    example: '2025-07-27T14:23:45.000Z',
    type: Date,
  })
    fecha: Date;
    @ApiProperty({
    description: 'Descripción del movimiento (ej: Transferencia a Juan, Pago de Spotify)',
    example: 'Transferencia a cuenta Corriente',
  })
    descripcion: string;
    @ApiProperty({
    description: 'Categoría del movimiento (Transferencia, Pago, etc.)',
    example: 'Transferencia',
  })
    categoria: string;
    @ApiProperty({
    description: 'Monto del movimiento. Positivo si se recibe dinero, negativo si se gasta.',
    example: -5000,
  })
    abono: number;
}
