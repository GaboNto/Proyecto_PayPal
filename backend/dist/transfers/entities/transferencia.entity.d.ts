import { User } from '../../users/user.entity';
import { UsuarioExterno } from './usuario-externo.entity';
export declare class Transferencia {
    id: number;
    usuario_origen: User;
    usuario_id_origen: number;
    usuario_destino: User;
    id_usuario_destino: number | null;
    usuario_externo: UsuarioExterno;
    id_usuario_externo: number | null;
    monto: number;
    comision: number;
    fecha: Date;
}
