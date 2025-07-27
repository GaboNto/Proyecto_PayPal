/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Req, ValidationPipe, Get, Query, NotFoundException, Param } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) { }
    /**
   * Realiza una transferencia entre cuentas propias del mismo usuario.
   */
  @UseGuards(JwtAuthGuard)
  @Post('between-accounts')
  @ApiOperation({ summary: 'Transferir entre cuentas propias del usuario' })
  @ApiBody({ type: CreateInternalTransferDto })
  @ApiResponse({ status: 201, description: 'Transferencia interna realizada con éxito' })
  transferBetweenOwnAccounts(
    @Body(new ValidationPipe()) createInternalTransferDto: CreateInternalTransferDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.transfersService.transferBetweenOwnAccounts(createInternalTransferDto, userId);
  }

  /**
   * Realiza una transferencia externa hacia un destinatario registrado.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Realizar una transferencia externa' })
  @ApiBody({ type: CreateTransferDto })
  @ApiResponse({ status: 201, description: 'Transferencia externa realizada con éxito' })
  create(@Body() createTransferDto: CreateTransferDto, @Req() req) {
    const usuarioOrigenId = req.user.sub;
    return this.transfersService.create(createTransferDto, usuarioOrigenId);
  }
  /**
   * Obtiene el historial de transferencias realizadas por el usuario autenticado.
   * Puede filtrar por fecha de inicio (`from`) y fin (`to`).
   */
  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiOperation({ summary: 'Obtener historial de transferencias con filtro opcional de fechas' })
  @ApiQuery({ name: 'from', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'to', required: false, example: '2025-07-31' })
  @ApiResponse({ status: 200, description: 'Historial filtrado por fechas obtenido con éxito' })
  async getHistory(@Req() req, @Query('from') from?: string, @Query('to') to?: string) {
    const userId = req.user.sub;
    return this.transfersService.getUserHistory(userId, from, to);
  }
  /**
   * Obtiene todo el historial de transferencias del usuario autenticado.
   */
  @UseGuards(JwtAuthGuard)
  @Get('historial')
  @ApiOperation({ summary: 'Obtener historial completo de transferencias del usuario' })
  @ApiResponse({ status: 200, description: 'Historial completo obtenido con éxito' })
  async obtenerHistorialUsuario(@Req() req) {
    const userId = req.user.sub; // id del usuario autenticado
    return this.transfersService.obtenerHistorialPorUsuario(userId);
  }
  /**
   * Consulta el tipo de cuenta y saldo actual, dado un número de cuenta específico.
   */
  @Get('cuenta-info/:numeroCuenta')
  @ApiOperation({ summary: 'Obtener tipo de cuenta y saldo por número de cuenta' })
  @ApiParam({ name: 'numeroCuenta', description: 'Número de cuenta a consultar', example: '123456789' })
  @ApiResponse({ status: 200, description: 'Tipo de cuenta y saldo obtenidos correctamente' })
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