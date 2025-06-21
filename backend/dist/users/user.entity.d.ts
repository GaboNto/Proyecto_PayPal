import { Card } from '../card/card.entity';
import { Saldo } from 'src/saldo/saldo/saldo.entity';
export declare class User {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    fecha_nacimiento: string;
    pais: string;
    ciudad: string;
    saldo: Saldo;
    cards: Card[];
}
