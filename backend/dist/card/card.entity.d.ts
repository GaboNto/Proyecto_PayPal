import { Cuenta } from '../cuentas/entities/cuenta.entity';
export declare class Card {
    id: string;
    cardNumber: string;
    cvv: string;
    expirationDate: string;
    is_blocked: boolean;
    cuenta: Cuenta;
}
