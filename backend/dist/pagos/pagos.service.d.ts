import { CreatePagoDto } from './dto/create-pago.dto';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
export declare class PagosService {
    private readonly pagosRepository;
    private readonly cuentaRepository;
    constructor(pagosRepository: Repository<Pago>, cuentaRepository: Repository<Cuenta>);
    create(createPagoDto: CreatePagoDto): Promise<{
        message: string;
        pago: Pago;
        nuevoSaldo: number;
    }>;
}
