import { User } from '../../users/user.entity';
export declare class Destinatario {
    id: number;
    propietario: User;
    nombre: string;
    rut: string;
    alias: string;
    correo_electronico: string;
    banco: string;
    tipo_cuenta: string;
    numero_cuenta: string;
    es_favorito: boolean;
}
