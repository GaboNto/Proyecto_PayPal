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
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Movimientos') // Agrupa todas las rutas de este controlador bajo la etiqueta "Movimientos" en Swagger UI
@Controller('cuentas') // La ruta base para este controlador es 'cuentas'
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) { }

  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  @Post(':cuentaId/movimientos') // Maneja solicitudes POST a /api/cuentas/:cuentaId/movimientos
  @HttpCode(HttpStatus.CREATED) // Retorna un código de estado 201 (Created) en caso de éxito
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Crea un nuevo movimiento para una cuenta específica' }) // Descripción de la operación
  @ApiParam({
    name: 'cuentaId',
    description: 'ID de la cuenta a la que se asociará el movimiento',
    type: 'integer',
    example: 1
  }) // Documenta el parámetro de la URL
  @ApiBody({ type: CreateMovimientoDto, description: 'Datos del nuevo movimiento' }) // Especifica el DTO para el cuerpo de la solicitud
  @ApiResponse({
    status: 201,
    description: 'Movimiento creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        tipo: { type: 'string', example: 'INGRESO' },
        monto: { type: 'number', example: 10000.00 },
        descripcion: { type: 'string', example: 'Depósito de salario' },
        fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:00:00Z' },
        // ... otras propiedades de la entidad Movimiento
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de movimiento inválidos o cuenta no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada' })
  async createMovimiento(
    @Param('cuentaId', ParseIntPipe) cuentaId: number, // Valida que cuentaId sea un número entero
    @Body() createMovimientoDto: CreateMovimientoDto, // El cuerpo de la solicitud se mapea a CreateMovimientoDto
  ) {
    const movimiento = await this.movimientoService.createMovimiento(
      cuentaId,
      createMovimientoDto,
    );
    return movimiento;
  }

  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  @Get(':cuentaId/movimientos') // Maneja solicitudes GET a /api/cuentas/:cuentaId/movimientos
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Obtiene todos los movimientos de una cuenta específica' }) // Descripción de la operación
  @ApiParam({
    name: 'cuentaId',
    description: 'ID de la cuenta de la cual se obtendrán los movimientos',
    type: 'integer',
    example: 1
  }) // Documenta el parámetro de la URL
  @ApiResponse({
    status: 200,
    description: 'Lista de movimientos de la cuenta',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          tipo: { type: 'string', example: 'GASTO' },
          monto: { type: 'number', example: 500.00 },
          descripcion: { type: 'string', example: 'Compra en supermercado' },
          fecha: { type: 'string', format: 'date-time', example: '2025-07-26T15:30:00Z' },
          // ... otras propiedades de la entidad Movimiento
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada' })
  async getMovimientosByCuentaId(@Param('cuentaId', ParseIntPipe) cuentaId: number) {
    const movimientos = await this.movimientoService.findMovimientosByCuentaId(cuentaId);
    return movimientos;
  }
}
