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
  Get
} from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto'; 

@Controller('movimientos')
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  @Post(':saldoId')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })) 
  async createMovimiento(
    @Param('saldoId', ParseIntPipe) saldoId: number,
    @Body() createMovimientoDto: CreateMovimientoDto, 
  ) {
    const movimiento = await this.movimientoService.createMovimiento(
    saldoId,
    createMovimientoDto,
  );
  return movimiento;
  }

  @Get('saldo/:saldoId')
  async getMovimientosBySaldoId(@Param('saldoId', ParseIntPipe) saldoId: number) {
    const movimientos = await this.movimientoService.findMovimientosBySaldoId(saldoId);
    return movimientos;
  }
}