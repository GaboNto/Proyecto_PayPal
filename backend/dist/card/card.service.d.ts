import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/createcard.dto';
import { User } from '../users/user.entity';
export declare class CardService {
    private cardRepository;
    private userRepository;
    constructor(cardRepository: Repository<Card>, userRepository: Repository<User>);
    createCard(dto: CreateCardDto, userId: string): Promise<Card>;
    getAll(): Promise<Card[]>;
    getByUser(userId: string): Promise<Card[]>;
    deleteCard(id: string): Promise<void>;
}
