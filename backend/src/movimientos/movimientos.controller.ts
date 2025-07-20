/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
// src/movimientos/movimientos.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMovimientos(@Req() req) {
    const userId = req.user.sub;
    return this.movimientosService.obtenerMovimientosPorUsuario(userId);
  }

  @Get('historial')
  @UseGuards(JwtAuthGuard)
  async obtenerHistorial(@Req() req) {
    const userId = req.user.sub; // id obtenido del token
    const historial = this.movimientosService.obtenerMovimientosPorUsuario(userId);
    return historial;
  }
}


