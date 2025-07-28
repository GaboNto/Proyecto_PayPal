import { User } from '../../users/user.entity';
export declare class Pago {
    id: number;
    usuario: User;
    idusuario: number;
    monto: number;
    descripcion: string;
    categoria: string;
    fecha: Date;
}
