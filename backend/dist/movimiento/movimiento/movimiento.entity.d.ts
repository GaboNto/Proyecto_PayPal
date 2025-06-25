import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
export declare class Movimiento {
    id: number;
    amount: number;
    type: string;
    date: Date;
    cuenta: Cuenta;
}
