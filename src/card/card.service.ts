import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/createcard.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createCard(dto: CreateCardDto, userId: string): Promise<Card> {
    const user = await this.userRepository.findOneBy({ id: Number(userId) });
    if (!user) throw new Error('Usuario no encontrado');

    const card = this.cardRepository.create({ ...dto, user });
    throw this.cardRepository.save(card);
  }

  async getAll(): Promise<Card[]> {
    return this.cardRepository.find({ relations: ['user'] });
  }

  async getByUser(userId: string): Promise<Card[]> {
    return this.cardRepository.find({
      where: { user: { id: Number(userId) } },
      relations: ['user'],
    });
  }

  async deleteCard(id: string): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
