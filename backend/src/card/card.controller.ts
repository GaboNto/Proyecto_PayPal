/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Patch, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cards')
@ApiBearerAuth()
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  /**
   * Cambia el estado de bloqueo de una tarjeta (activa ↔ bloqueada).
   * Esta operación es segura y requiere autenticación con JWT.
   *
   * @param id UUID de la tarjeta que se desea modificar.
   * @returns Estado actualizado de la tarjeta con la información relevante.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-block')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID de la tarjeta que se desea bloquear o desbloquear',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarjeta actualizada correctamente. Se devuelve el nuevo estado.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Token inválido o ausente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarjeta no encontrada o no pertenece al usuario autenticado.',
  })
  toggleBlockStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    // req.user es el payload del JWT, que contiene los datos del usuario logueado
    return this.cardService.toggleBlock(id, req.user);
  }
} 