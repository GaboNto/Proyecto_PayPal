import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cuentas')
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findUserAccounts(@Request() req) {
    return this.cuentasService.findByUserId(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAccount(@Request() req, @Body() body: { tipo_cuenta: string }) {
    return this.cuentasService.create(req.user.sub, body.tipo_cuenta);
  }
} 