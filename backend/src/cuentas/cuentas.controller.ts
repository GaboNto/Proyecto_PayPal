/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Cuentas') // Agrupa todas las rutas de este controlador bajo la etiqueta "Cuentas" en Swagger UI
@Controller('cuentas')
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) { }

  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  @Get()
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Obtiene todas las cuentas bancarias del usuario autenticado' }) // Descripción de la operación
  @ApiResponse({
    status: 200,
    description: 'Lista de cuentas del usuario',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
          numero_cuenta: { type: 'string', example: 'CL1234567890' },
          tipo_cuenta: { type: 'string', example: 'Cuenta Corriente' },
          saldo: { type: 'number', format: 'float', example: 1500000.00 },
          // ... otras propiedades de la entidad Cuenta
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado o sin cuentas' })
  findUserAccounts(@Request() req) {
    return this.cuentasService.findByUserId(req.user.sub);
  }

  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  @Post()
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Crea una nueva cuenta bancaria para el usuario autenticado' }) // Descripción de la operación
  @ApiBody({
    schema: { // Define el esquema del cuerpo de la solicitud
      type: 'object',
      properties: {
        tipo_cuenta: {
          type: 'string',
          example: 'Cuenta de Ahorro',
          enum: ['Cuenta Corriente', 'Cuenta de Ahorro', 'Cuenta Vista'] // Ejemplos de tipos de cuenta
        },
      },
      required: ['tipo_cuenta']
    },
    description: 'Tipo de cuenta a crear (ej. "Cuenta Corriente", "Cuenta de Ahorro", "Cuenta Vista").'
  })
  @ApiResponse({
    status: 201,
    description: 'Cuenta creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        numero_cuenta: { type: 'string', example: 'CL9876543210' },
        tipo_cuenta: { type: 'string', example: 'Cuenta de Ahorro' },
        saldo: { type: 'number', format: 'float', example: 0.00 },
        // ... otras propiedades de la entidad Cuenta
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Tipo de cuenta inválido o ya existe una cuenta de ese tipo' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async createAccount(@Request() req, @Body() body: { tipo_cuenta: string }) {
    return this.cuentasService.create(req.user.sub, body.tipo_cuenta);
  }
}
