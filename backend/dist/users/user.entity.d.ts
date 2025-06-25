import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { Destinatario } from '../destinatarios/entities/destinatario.entity';
export declare class User {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    fecha_nacimiento: string;
    pais: string;
    ciudad: string;
    rut: string;
    banco: string;
    cuentas: Cuenta[];
    destinatarios: Destinatario[];
    bepass: string;
}
