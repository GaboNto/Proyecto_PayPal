/* eslint-disable prettier/prettier */
// src/movimientos/movimientos.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MovimientoHistorialDto } from './dto/movimiento-historial.dto'; // Importa el DTO de historial

@ApiTags('Movimientos') // Agrupa todas las rutas de este controlador bajo la etiqueta "Movimientos" en Swagger UI
@UseGuards(JwtAuthGuard) // Protege todas las rutas de este controlador con JWT
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) { }

  @Get()
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Obtiene todos los movimientos detallados para el usuario autenticado' }) // Descripción de la operación
  @ApiResponse({
    status: 200,
    description: 'Lista de movimientos detallados del usuario',
    type: [MovimientoHistorialDto] // Especifica que retorna un array de MovimientoHistorialDto
  })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  async getMovimientos(@Req() req) {
    const userId = req.user.sub;
    return this.movimientosService.obtenerMovimientosPorUsuario(userId);
  }

  @Get('historial')
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Obtiene el historial de movimientos simplificado para el usuario autenticado' }) // Descripción de la operación
  @ApiResponse({
    status: 200,
    description: 'Historial de movimientos simplificado del usuario',
    type: [MovimientoHistorialDto] // Especifica que retorna un array de MovimientoHistorialDto
  })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  async obtenerHistorial(@Req() req) {
    const userId = req.user.sub; // id obtenido del token
    const historial = this.movimientosService.obtenerMovimientosPorUsuario(userId);
    return historial;
  }
}
