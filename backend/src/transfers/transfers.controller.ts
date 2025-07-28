/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Req, ValidationPipe, Get, Query, NotFoundException, Param } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Transfers') // Agrupa todas las rutas de este controlador bajo la etiqueta "Transfers" en Swagger UI
@Controller('transfers') // Define la ruta base para este controlador, por ejemplo, /api/transfers
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) { }

  @UseGuards(JwtAuthGuard) // Protege este endpoint, requiriendo un token JWT válido
  @Post('between-accounts') // Maneja solicitudes POST a /api/transfers/between-accounts
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Realiza una transferencia entre cuentas propias del usuario autenticado' }) // Descripción de la operación
  @ApiBody({ type: CreateInternalTransferDto, description: 'Datos para la transferencia entre cuentas propias' }) // Especifica el DTO
  @ApiResponse({
    status: 201,
    description: 'Transferencia interna realizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        monto: { type: 'number', example: 50000.00 },
        cuentaOrigen: { type: 'string', example: 'CL1234567890' },
        cuentaDestino: { type: 'string', example: 'CL0987654321' },
        // ... otras propiedades de la transferencia
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de transferencia inválidos, fondos insuficientes o cuentas no encontradas' })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido (las cuentas no pertenecen al usuario)' })
  transferBetweenOwnAccounts(
    @Body(new ValidationPipe()) createInternalTransferDto: CreateInternalTransferDto,
    @Req() req,
  ) {
    const userId = req.user.sub; // Obtiene el ID del usuario autenticado
    return this.transfersService.transferBetweenOwnAccounts(createInternalTransferDto, userId);
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint, requiriendo un token JWT válido
  @Post() // Maneja solicitudes POST a /api/transfers
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Crea una transferencia a un destinatario externo' }) // Descripción de la operación
  @ApiBody({ type: CreateTransferDto, description: 'Datos para la transferencia a un destinatario externo' }) // Especifica el DTO
  @ApiResponse({
    status: 201,
    description: 'Transferencia externa realizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 2 },
        monto: { type: 'number', example: 100000.00 },
        cuentaOrigen: { type: 'string', example: 'CL1234567890' },
        destinatario: { type: 'string', example: 'Juan Pérez' },
        // ... otras propiedades de la transferencia
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de transferencia inválidos, fondos insuficientes o destinatario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Cuenta de origen o destinatario no encontrado' })
  create(@Body() createTransferDto: CreateTransferDto, @Req() req) {
    const usuarioOrigenId = req.user.sub; // Obtiene el ID del usuario autenticado
    return this.transfersService.create(createTransferDto, usuarioOrigenId);
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint
  @Get('history') // Maneja solicitudes GET a /api/transfers/history
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtiene el historial de transferencias del usuario autenticado con filtros opcionales de fecha' })
  @ApiQuery({ name: 'from', required: false, type: 'string', format: 'date', description: 'Fecha de inicio para filtrar (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, type: 'string', format: 'date', description: 'Fecha de fin para filtrar (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Historial de transferencias del usuario',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          monto: { type: 'number', example: 50000.00 },
          fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:00:00Z' },
          tipo: { type: 'string', example: 'transferencia_enviada' },
          // ... otras propiedades relevantes del historial
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getHistory(@Req() req, @Query('from') from?: string, @Query('to') to?: string) {
    const userId = req.user.sub;
    return this.transfersService.getUserHistory(userId, from, to);
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint
  @Get('historial') // Maneja solicitudes GET a /api/transfers/historial
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtiene el historial simplificado de transferencias del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Historial simplificado de transferencias del usuario',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          monto: { type: 'number', example: 50000.00 },
          fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:00:00Z' },
          tipo: { type: 'string', example: 'transferencia_enviada' },
          // ... otras propiedades relevantes del historial
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async obtenerHistorialUsuario(@Req() req) {
    const userId = req.user.sub; // id del usuario autenticado
    return this.transfersService.obtenerHistorialPorUsuario(userId);
  }

  @Get('cuenta-info/:numeroCuenta') // Maneja solicitudes GET a /api/transfers/cuenta-info/:numeroCuenta
  @ApiOperation({ summary: 'Obtiene el tipo y saldo de una cuenta por su número de cuenta' })
  @ApiParam({
    name: 'numeroCuenta',
    description: 'Número de cuenta para obtener información',
    type: 'string',
    example: 'CL1234567890'
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cuenta y saldo encontrados',
    schema: {
      type: 'object',
      properties: {
        tipoCuenta: { type: 'string', example: 'Cuenta Corriente' },
        saldo: { type: 'number', example: 1500000.00 }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada' })
  async obtenerTipoYSaldo(@Param('numeroCuenta') numeroCuenta: string) {
    const resultado = await this.transfersService.obtenerTipoYSaldoPorNumeroCuenta(numeroCuenta);
    if (!resultado.tipoCuenta && resultado.saldo === null) {
      throw new NotFoundException('Cuenta no encontrada');
    }
    console.log(resultado)
    return resultado;
  }
  
}

