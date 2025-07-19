/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Req, ValidationPipe, Get, Query } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) { }

  @UseGuards(JwtAuthGuard)
  @Post('between-accounts')
  transferBetweenOwnAccounts(
    @Body(new ValidationPipe()) createInternalTransferDto: CreateInternalTransferDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.transfersService.transferBetweenOwnAccounts(createInternalTransferDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTransferDto: CreateTransferDto, @Req() req) {
    const usuarioOrigenId = req.user.sub;
    return this.transfersService.create(createTransferDto, usuarioOrigenId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@Req() req, @Query('from') from?: string, @Query('to') to?: string) {
    const userId = req.user.sub;
    return this.transfersService.getUserHistory(userId, from, to);
  }

  @UseGuards(JwtAuthGuard)
  @Get('historial')
  async obtenerHistorialUsuario(@Req() req) {
    const userId = req.user.sub; // id del usuario autenticado
    return this.transfersService.obtenerHistorialPorUsuario(userId);
  }


} 