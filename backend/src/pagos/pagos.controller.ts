/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }
  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @ApiResponse({ status: 201, description: 'Pago creado correctamente.' })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente o datos inválidos.' })
  @Post()
  async create(@Body() createPagoDto: CreatePagoDto) {
    return await this.pagosService.create(createPagoDto);
  }
}
