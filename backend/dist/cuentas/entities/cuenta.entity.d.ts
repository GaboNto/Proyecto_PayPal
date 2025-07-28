import { User } from '../../users/user.entity';
import { Movimiento } from '../../movimiento/movimiento/movimiento.entity';
import { Card } from '../../card/card.entity';
export declare class Cuenta {
    id: number;
    usuario: User;
    numero_cuenta: string;
    tipo_cuenta: string;
    saldo: number;
    fecha_apertura: Date;
    movimientos: Movimiento[];
    cards: Card[];
}
