import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
export declare class TransfersController {
    private readonly transfersService;
    constructor(transfersService: TransfersService);
    transferBetweenOwnAccounts(createInternalTransferDto: CreateInternalTransferDto, req: any): Promise<{
        message: string;
    }>;
    create(createTransferDto: CreateTransferDto, req: any): Promise<{
        message: string;
    }>;
    getHistory(req: any, from?: string, to?: string): Promise<any>;
    obtenerHistorialUsuario(req: any): Promise<any>;
    obtenerTipoYSaldo(numeroCuenta: string): Promise<{
        tipoCuenta: string | null;
        saldo: number | null;
    }>;
}
