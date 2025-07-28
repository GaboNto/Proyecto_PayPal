import { CuentasService } from './cuentas.service';
export declare class CuentasController {
    private readonly cuentasService;
    constructor(cuentasService: CuentasService);
    findUserAccounts(req: any): Promise<import("./entities/cuenta.entity").Cuenta[]>;
    createAccount(req: any, body: {
        tipo_cuenta: string;
    }): Promise<import("./entities/cuenta.entity").Cuenta>;
}
