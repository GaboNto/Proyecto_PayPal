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
  /**
   * Alterna el estado de bloqueo de una tarjeta (bloqueada ↔ desbloqueada).
   *
   * Este método verifica si la tarjeta existe y si pertenece al usuario autenticado
   * antes de cambiar su estado. Si la tarjeta no se encuentra o el usuario no es el
   * propietario, se lanzan excepciones apropiadas.
   *
   * @param cardId UUID de la tarjeta a modificar.
   * @param user Objeto extraído del token JWT que contiene el ID del usuario autenticado.
   * @returns La tarjeta con el nuevo estado actualizado (`is_blocked` true o false).
   *
   * @throws NotFoundException si la tarjeta no existe.
   * @throws ForbiddenException si el usuario no es propietario de la tarjeta.
   */
  async toggleBlock(cardId: string, user: { sub: number }): Promise<Card> {
    // Buscar la tarjeta por su ID, incluyendo la cuenta y el usuario relacionados
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['cuenta', 'cuenta.usuario'], // Cargar la relación con la cuenta y el usuario
    });
    // Validar existencia de la tarjeta
    if (!card) {
      throw new NotFoundException('Tarjeta no encontrada.');
    }

    // Verificamos que el usuario que hace la petición es el dueño de la cuenta a la que pertenece la tarjeta
    // El 'user' del token JWT tiene la id en la propiedad 'sub'
    if (card.cuenta.usuario.id_usuario !== user.sub) {
      throw new ForbiddenException('No tienes permiso para modificar esta tarjeta.');
    }
    // Guardar y devolver la tarjeta actualizada
    card.is_blocked = !card.is_blocked;
    return this.cardRepository.save(card);
  }
} 