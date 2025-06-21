import { SaldoService } from './saldo.service';
export declare class SaldoController {
    private readonly saldoService;
    constructor(saldoService: SaldoService);
    getSaldoByUserId(userId: number): Promise<import("./saldo.entity").Saldo | {
        message: string;
    }>;
}
