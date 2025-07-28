/* eslint-disable prettier/prettier */
// src/movimientos/dto/movimiento-historial.dto.ts
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class MovimientoHistorialDto {
    @ApiProperty({
        description: 'Fecha y hora del movimiento',
        example: '2025-07-27T10:00:00.000Z',
        type: 'string',
        format: 'date-time',
    })
    fecha: Date;

    @ApiProperty({
        description: 'Descripción del movimiento',
        example: 'Compra en supermercado',
    })
    descripcion: string;

    @ApiProperty({
        description: 'Categoría del movimiento',
        example: 'Alimentos',
    })
    categoria: string;

    @ApiProperty({
        description: 'Monto del abono o cargo (positivo para ingresos, negativo para gastos)',
        example: -5000.00,
        type: 'number',
        format: 'float',
    })
    abono: number;
}
