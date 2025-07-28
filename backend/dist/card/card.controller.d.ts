import { CardService } from './card.service';
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    toggleBlockStatus(id: string, req: any): Promise<import("./card.entity").Card>;
}
