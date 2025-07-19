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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Movimientos')
@ApiBearerAuth()
@Controller('cuentas')
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':cuentaId/movimientos')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo movimiento (depósito, retiro, transferencia)' })
  @ApiParam({ name: 'cuentaId', description: 'ID de la cuenta a la cual se le asociará el movimiento' })
  @ApiBody({ type: CreateMovimientoDto, description: 'Datos del movimiento a registrar' })
  @ApiResponse({ status: 201, description: 'Movimiento creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para el movimiento' })
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
  @ApiOperation({ summary: 'Obtener movimientos asociados a una cuenta' })
  @ApiParam({ name: 'cuentaId', description: 'ID de la cuenta para listar los movimientos' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos de la cuenta' })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada o sin movimientos' })
  async getMovimientosByCuentaId(@Param('cuentaId', ParseIntPipe) cuentaId: number) {
    const movimientos = await this.movimientoService.findMovimientosByCuentaId(cuentaId);
    return movimientos;
  }
}