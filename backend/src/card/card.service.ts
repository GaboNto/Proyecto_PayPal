import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  async toggleBlock(cardId: string, user: { sub: number }): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['cuenta', 'cuenta.usuario'], // Cargar la relación con la cuenta y el usuario
    });

    if (!card) {
      throw new NotFoundException('Tarjeta no encontrada.');
    }

    // Verificamos que el usuario que hace la petición es el dueño de la cuenta a la que pertenece la tarjeta
    // El 'user' del token JWT tiene la id en la propiedad 'sub'
    if (card.cuenta.usuario.id_usuario !== user.sub) {
      throw new ForbiddenException('No tienes permiso para modificar esta tarjeta.');
    }

    card.is_blocked = !card.is_blocked;
    return this.cardRepository.save(card);
  }
} 