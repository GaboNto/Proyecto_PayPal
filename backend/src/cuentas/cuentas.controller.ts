/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cuenta } from './entities/cuenta.entity';

@ApiTags('Cuentas')
@ApiBearerAuth()
@Controller('cuentas')
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) {}
  /**
   * Obtiene todas las cuentas asociadas al usuario autenticado.
   * 
   * @param req Objeto de solicitud que contiene los datos del usuario autenticado.
   * @returns Lista de cuentas del usuario.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener cuentas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Cuentas encontradas correctamente', type: [Cuenta] })
  findUserAccounts(@Request() req) {
    return this.cuentasService.findByUserId(req.user.sub);
  }
  /**
   * Crea una nueva cuenta para el usuario autenticado.
   * 
   * @param req Objeto de solicitud que contiene los datos del usuario autenticado.
   * @param body Objeto con el tipo de cuenta a crear.
   * @returns Cuenta creada con éxito.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear nueva cuenta para el usuario autenticado' })
  @ApiBody({
    description: 'Tipo de cuenta que se desea crear',
    schema: {
      type: 'object',
      properties: {
        tipoCuenta: {
          type: 'string',
          example: 'Cuenta Vista',
        },
      },
      required: ['tipoCuenta'],
    },
  })
  @ApiResponse({ status: 201, description: 'Cuenta creada exitosamente', type: Cuenta })
  createAccount(@Request() req, @Body() body: { tipo_cuenta: string }) {
    return this.cuentasService.create(req.user.sub, body.tipo_cuenta);
  }
} 