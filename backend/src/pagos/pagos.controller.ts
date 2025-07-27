/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { CreateCreditCardPaymentDto } from './dto/create-credit-card-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Pagos') // Agrupa todas las rutas de este controlador bajo la etiqueta "Pagos" en Swagger UI
@Controller('pagos') // Define la ruta base para este controlador, por ejemplo, /api/pagos
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo pago general' }) // Descripción de la operación
  @ApiBody({ type: CreatePagoDto, description: 'Datos para crear un pago' }) // Especifica el DTO para el cuerpo de la solicitud
  @ApiResponse({
    status: 201,
    description: 'Pago creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        monto: { type: 'number', example: 100.00 },
        descripcion: { type: 'string', example: 'Pago de servicio' },
        fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:00:00Z' },
        // ... otras propiedades de la entidad Pago
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de pago inválidos' })
  async create(@Body() createPagoDto: CreatePagoDto) {
    return await this.pagosService.create(createPagoDto);
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint, requiriendo un token JWT válido
  @Post('debit-card') // <-- ¡NUEVO ENDPOINT para tarjeta de crédito!
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Crea un nuevo pago utilizando una tarjeta de crédito/débito' }) // Descripción de la operación
  @ApiBody({ type: CreateCreditCardPaymentDto, description: 'Datos del pago con tarjeta de crédito/débito' }) // Especifica el DTO
  @ApiResponse({
    status: 201,
    description: 'Pago con tarjeta creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 2 },
        monto: { type: 'number', example: 50.00 },
        descripcion: { type: 'string', example: 'Compra online' },
        fecha: { type: 'string', format: 'date-time', example: '2025-07-27T10:05:00Z' },
        // ... otras propiedades relevantes del pago
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de pago o tarjeta inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  @ApiResponse({ status: 404, description: 'Cuenta o tarjeta no encontrada' })
  @ApiResponse({ status: 402, description: 'Fondos insuficientes (si aplica)' })
  async createCreditCardPayment(@Req() req, @Body() createCreditCardPaymentDto: CreateCreditCardPaymentDto) {
    // Puedes usar el userId si tu lógica de negocio lo requiere aquí.
    // const userId = req.user.sub;
    const result = await this.pagosService.createCreditCardPayment(createCreditCardPaymentDto);
    return result;
  }
}
