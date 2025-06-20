import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/createcard.dto';
import { Card } from './card.entity';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post(':userId')
  async create(
    @Param('userId') userId: string,
    @Body() dto: CreateCardDto,
  ): Promise<Card> {
    return this.cardService.createCard(dto, userId);
  }

  @Get()
  async findAll(): Promise<Card[]> {
    return this.cardService.getAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Card[]> {
    return this.cardService.getByUser(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.cardService.deleteCard(id);
  }
}
