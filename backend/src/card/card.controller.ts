/* eslint-disable prettier/prettier */
import { Controller, Patch, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('cards')
@ApiBearerAuth()
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-block')
  @ApiOperation({ summary: 'Bloquear o desbloquear una tarjeta' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID de la tarjeta a modificar',
    example: 'a24e34ff-f1a9-4bc3-90c9-d2b5d82e59b7',
  })
  @ApiResponse({ status: 200, description: 'Estado de bloqueo de la tarjeta actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'ID de tarjeta inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado' }) 
  toggleBlockStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    // req.user es el payload del JWT, que contiene los datos del usuario logueado
    return this.cardService.toggleBlock(id, req.user);
  }
} 