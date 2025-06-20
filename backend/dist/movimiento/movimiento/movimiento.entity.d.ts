import { Saldo } from 'src/saldo/saldo/saldo.entity';
import { Card } from 'src/card/card.entity';
export declare class Movimiento {
    id: number;
    amount: number;
    type: string;
    date: Date;
    saldo: Saldo;
    card: Card;
}
