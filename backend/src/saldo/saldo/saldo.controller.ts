/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'; 
import { SaldoService } from './saldo.service'; 

@Controller('saldos') 
export class SaldoController {
  constructor(private readonly saldoService: SaldoService) {} 

  @Get('user/:userId') 
  async getSaldoByUserId(@Param('userId', ParseIntPipe) userId: number) {
    const saldo = await this.saldoService.findSaldoByUserId(userId);
    if (!saldo) {
      return { message: 'Saldo no encontrado para este usuario' };
    }
    return saldo;
  }

 
}