/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }

  @Post()
  async create(@Body() createPagoDto: CreatePagoDto) {
    return await this.pagosService.create(createPagoDto);
  }
}
