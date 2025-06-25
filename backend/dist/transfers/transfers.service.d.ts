import { Repository, DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Transferencia } from './entities/transferencia.entity';
import { UsuarioExterno } from './entities/usuario-externo.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
export declare class TransfersService {
    private usersRepository;
    private transferenciasRepository;
    private usuariosExternosRepository;
    private cuentasRepository;
    private dataSource;
    constructor(usersRepository: Repository<User>, transferenciasRepository: Repository<Transferencia>, usuariosExternosRepository: Repository<UsuarioExterno>, cuentasRepository: Repository<Cuenta>, dataSource: DataSource);
    transferBetweenOwnAccounts(createDto: CreateInternalTransferDto, userId: number): Promise<{
        message: string;
    }>;
    create(createTransferDto: CreateTransferDto, usuarioOrigenId: number): Promise<{
        message: string;
    }>;
}
