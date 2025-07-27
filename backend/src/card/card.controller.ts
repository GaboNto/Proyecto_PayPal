/* eslint-disable prettier/prettier */
import { Controller, Patch, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Cards') // Agrupa todas las rutas de este controlador bajo la etiqueta "Cards" en Swagger UI
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  @Patch(':id/toggle-block')
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Cambia el estado de bloqueo de una tarjeta (bloquear/desbloquear)' }) // Descripción de la operación
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la tarjeta a bloquear/desbloquear',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  }) // Documenta el parámetro de la URL
  @ApiResponse({
    status: 200,
    description: 'Estado de bloqueo de la tarjeta actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        cardNumber: { type: 'string', example: '**** **** **** 1234' },
        is_blocked: { type: 'boolean', example: true },
        // ... otras propiedades de la tarjeta
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  @ApiResponse({ status: 403, description: 'Prohibido (el usuario no tiene permisos para esta tarjeta)' })
  @ApiResponse({ status: 404, description: 'Tarjeta no encontrada' })
  toggleBlockStatus(
    @Param('id', ParseUUIDPipe) id: string, // Valida que el ID sea un UUID
    @Request() req, // Accede al objeto de solicitud para obtener los datos del usuario
  ) {
    // req.user es el payload del JWT, que contiene los datos del usuario logueado
    // Llama al servicio para cambiar el estado de bloqueo de la tarjeta
    return this.cardService.toggleBlock(id, req.user);
  }
}
