import { User } from '../users/user.entity';
import { Movimiento } from 'src/movimiento/movimiento/movimiento.entity';
export declare class Card {
    id: string;
    cardNumber: string;
    cvv: string;
    expirationDate: string;
    user: User;
    movimientos: Movimiento[];
}
