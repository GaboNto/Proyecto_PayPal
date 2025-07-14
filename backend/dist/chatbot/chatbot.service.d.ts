import { Pago } from 'src/pagos/entities/pago.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
export declare class ChatbotService {
    private readonly pagoRepo;
    private readonly userRepo;
    private readonly cuentasRepo;
    constructor(pagoRepo: Repository<Pago>, userRepo: Repository<User>, cuentasRepo: Repository<Cuenta>);
    private readonly API_KEY;
    private readonly MODEL;
    private readonly API_URL;
    enviarMensaje(prompt: string): Promise<string>;
    getPagos(userId: string): Promise<string>;
    obtenerCuentasPorUsuario(id_usuario: number): Promise<Cuenta[]>;
    limpiarCuentas(cuentas: any[]): any[];
    formatearCuentas(cuentas: any[]): string;
}
