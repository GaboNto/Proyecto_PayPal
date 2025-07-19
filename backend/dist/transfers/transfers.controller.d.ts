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
    getHistory(req: any, from?: string, to?: string): Promise<{
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
    obtenerHistorialUsuario(req: any): Promise<import("./entities/historial-saldos").HistorialSaldos[]>;
}
