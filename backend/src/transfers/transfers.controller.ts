/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Req, ValidationPipe, Get, Query } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Transfers')// agrupa todo el controlador con la etiqueta tranfers
@ApiBearerAuth() // esto requiere de JWT
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('between-accounts')
  @ApiOperation({ summary: 'Transferencia entre cuentas propias del usuario' }) //para describir lo que hace
  @ApiBody({ type: CreateInternalTransferDto }) //describe el cuerpo
  transferBetweenOwnAccounts(
    @Body(new ValidationPipe()) createInternalTransferDto: CreateInternalTransferDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.transfersService.transferBetweenOwnAccounts(createInternalTransferDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Transferencia a otro usuario del sistema' })
  @ApiBody({ type: CreateTransferDto })
  create(@Body() createTransferDto: CreateTransferDto, @Req() req) {
    // el ID del usuario autenticado se extrae del token JWT
    const usuarioOrigenId = req.user.sub; 
    return this.transfersService.create(createTransferDto, usuarioOrigenId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiOperation({ summary: 'Historial de transferencias del usuario autenticado' })
  @ApiQuery({ name: 'from', required: false, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Fecha de fin (YYYY-MM-DD)' })
  async getHistory(@Req() req, @Query('from') from?: string, @Query('to') to?: string) {
    const userId = req.user.sub;
    return this.transfersService.getUserHistory(userId, from, to);
  }
} 