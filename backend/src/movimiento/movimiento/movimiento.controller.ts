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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Movimientos por cuenta')
@ApiBearerAuth()
@Controller('cuentas')
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}
  /**
   * Crea un nuevo movimiento (depósito, retiro o transferencia) en una cuenta específica.
   * 
   * @param cuentaId - ID de la cuenta donde se realiza el movimiento.
   * @param createMovimientoDto - Datos del movimiento a registrar.
   * @returns Detalles del movimiento creado.
   */
  @UseGuards(JwtAuthGuard)
  @Post(':cuentaId/movimientos')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })) 
  @ApiOperation({ summary: 'Crear movimiento en cuenta' })
  @ApiParam({ name: 'cuentaId', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({ status: 201, description: 'Movimiento creado correctamente' })
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
  /**
   * Obtiene el historial de movimientos realizados en una cuenta específica.
   * 
   * @param cuentaId - ID de la cuenta.
   * @returns Lista de movimientos asociados a la cuenta.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':cuentaId/movimientos')
  @ApiOperation({ summary: 'Obtener movimientos por cuenta' })
  @ApiParam({ name: 'cuentaId', type: Number, description: 'ID de la cuenta' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos de la cuenta' })
  async getMovimientosByCuentaId(@Param('cuentaId', ParseIntPipe) cuentaId: number) {
    const movimientos = await this.movimientoService.findMovimientosByCuentaId(cuentaId);
    return movimientos;
  }
}