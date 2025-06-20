import { User } from 'src/users/user.entity';
import { Movimiento } from 'src/movimiento/movimiento/movimiento.entity';
export declare class Saldo {
    id: number;
    amount: number;
    user: User;
    movimientos: Movimiento[];
}
