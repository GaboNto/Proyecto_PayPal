/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
@ApiTags('Cuentas') 
@ApiBearerAuth() 
@Controller('cuentas')
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener cuentas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de cuentas devuelto correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findUserAccounts(@Request() req) {
    return this.cuentasService.findByUserId(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva cuenta para el usuario autenticado' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tipo_cuenta: {
          type: 'string',
          example: 'corriente',
          description: 'Tipo de cuenta a crear (ej. corriente, vista, ahorro)',
        },
      },
      required: ['tipo_cuenta'],
    },
  })
  @ApiResponse({ status: 201, description: 'Cuenta creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  createAccount(@Request() req, @Body() body: { tipo_cuenta: string }) {
    return this.cuentasService.create(req.user.sub, body.tipo_cuenta);
  }
} 