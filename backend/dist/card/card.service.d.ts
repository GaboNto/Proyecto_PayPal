import { Repository } from 'typeorm';
import { Card } from './card.entity';
export declare class CardService {
    private cardRepository;
    constructor(cardRepository: Repository<Card>);
    toggleBlock(cardId: string, user: {
        sub: number;
    }): Promise<Card>;
}
