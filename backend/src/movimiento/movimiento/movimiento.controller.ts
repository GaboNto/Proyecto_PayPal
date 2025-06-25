/* eslint-disable prettier/prettier */
import { 
  Controller, 
  Post, 
  Body, 
  Param, 
  ParseIntPipe, 
  HttpCode, 
  HttpStatus,
  UsePipes, // Importa UsePipes
  ValidationPipe, // Importa ValidationPipe
  Get,
  UseGuards
} from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto'; 
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cuentas')
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':cuentaId/movimientos')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })) 
  async createMovimiento(
    @Param('cuentaId', ParseIntPipe) cuentaId: number,
    @Body() createMovimientoDto: CreateMovimientoDto, 
  ) {
    const movimiento = await this.movimientoService.createMovimiento(
    cuentaId,
    createMovimientoDto,
  );
  return movimiento;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cuentaId/movimientos')
  async getMovimientosByCuentaId(@Param('cuentaId', ParseIntPipe) cuentaId: number) {
    const movimientos = await this.movimientoService.findMovimientosByCuentaId(cuentaId);
    return movimientos;
  }
}