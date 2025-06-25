import { Controller, Patch, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-block')
  toggleBlockStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ) {
    // req.user es el payload del JWT, que contiene los datos del usuario logueado
    return this.cardService.toggleBlock(id, req.user);
  }
} 