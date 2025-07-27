/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
// src/movimientos/movimientos.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MovimientoHistorialDto } from './dto/movimiento-historial.dto';

@ApiTags('Movimientos')
@ApiBearerAuth()
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) { }

    /**
   * Obtiene todos los movimientos financieros del usuario autenticado,
   * incluyendo pagos realizados y transferencias (emitidas o recibidas).
   *
   * @returns Arreglo de movimientos en orden cronológico (más recientes primero)
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los movimientos del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Historial completo de movimientos',
    type: [MovimientoHistorialDto],
  })
  async getMovimientos(@Req() req) {
    const userId = req.user.sub;
    return this.movimientosService.obtenerMovimientosPorUsuario(userId);
  }

    /**
   * Alias del endpoint GET /movimientos. Devuelve el mismo historial de movimientos.
   * Puede utilizarse si se desea mantener rutas semánticas.
   *
   * @returns Arreglo de movimientos en orden cronológico
   */
  @Get('historial')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Alias: Obtener historial de movimientos del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Historial de movimientos',
    type: [MovimientoHistorialDto],
  })
  async obtenerHistorial(@Req() req) {
    const userId = req.user.sub; // id obtenido del token
    const historial = this.movimientosService.obtenerMovimientosPorUsuario(userId);
    return historial;
  }
}


