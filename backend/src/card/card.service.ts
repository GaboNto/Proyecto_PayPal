import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';

/**
 * @class CardService
 * @description Servicio encargado de la lógica de la gestión de tarjetas bancarias.
 * permite bloquear y desbloquear las tarjetas,
 * asegurando que solo el propietario de la tarjeta pueda realizar esta acción.
 */
@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

    /**
   * @method toggleBlock
   * @description Cambia el estado de bloqueo (`is_blocked`) de una tarjeta específica.
   * Este método verifica que el usuario que realiza la petición sea el propietario de la tarjeta
   * antes de modificar su estado.
   * @param cardId El ID de la tarjeta 
   * @param user Objeto que contiene la información del usuario autenticado, obtenida del token JWT.
   * Se espera que `user.sub` contenga el ID del usuario propietario.
   * @returns retorna la entidad Card actualizada con el nuevo estado de bloqueo.
   * @throws NotFoundException Si la tarjeta con el `cardId` proporcionado no se encuentra en la base de datos.
   * @throws ForbiddenException Si el usuario autenticado no es el propietario de la tarjeta, impidiendo la modificación.
   */
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