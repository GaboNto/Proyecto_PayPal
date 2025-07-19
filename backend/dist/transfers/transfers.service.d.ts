import { Repository, DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Transferencia } from './entities/transferencia.entity';
import { UsuarioExterno } from './entities/usuario-externo.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { HistorialSaldos } from './entities/historial-saldos';
export declare class TransfersService {
    private usersRepository;
    private transferenciasRepository;
    private usuariosExternosRepository;
    private cuentasRepository;
    private historialRepository;
    private dataSource;
    constructor(usersRepository: Repository<User>, transferenciasRepository: Repository<Transferencia>, usuariosExternosRepository: Repository<UsuarioExterno>, cuentasRepository: Repository<Cuenta>, historialRepository: Repository<HistorialSaldos>, dataSource: DataSource);
    transferBetweenOwnAccounts(createDto: CreateInternalTransferDto, userId: number): Promise<{
        message: string;
    }>;
    create(createTransferDto: CreateTransferDto, usuarioOrigenId: number): Promise<{
        message: string;
    }>;
    getUserHistory(userId: number, from?: string, to?: string): Promise<{
        id: number;
        fecha: Date;
        monto: number;
        comision: number;
        tipo: string;
        origen: {
            rut: string;
            nombre: string;
            id_usuario: number;
        } | null;
        destino: any;
        hora: string | null;
    }[]>;
    obtenerHistorialPorUsuario(usuarioId: number): Promise<HistorialSaldos[]>;
    obtenerTipoYSaldoPorNumeroCuenta(numeroCuenta: string): Promise<{
        tipoCuenta: string | null;
        saldo: number | null;
    }>;
}
