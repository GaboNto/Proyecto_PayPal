import { CardService } from './card.service';
import { CreateCardDto } from './dto/createcard.dto';
import { Card } from './card.entity';
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    create(userId: string, dto: CreateCardDto): Promise<Card>;
    findAll(): Promise<Card[]>;
    findByUser(userId: string): Promise<Card[]>;
    delete(id: string): Promise<void>;
}
