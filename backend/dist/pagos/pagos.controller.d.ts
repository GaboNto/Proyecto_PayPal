import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
export declare class PagosController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
    create(createPagoDto: CreatePagoDto): Promise<{
        message: string;
        pago: import("./entities/pago.entity").Pago;
    }>;
    findAll(): Promise<import("./entities/pago.entity").Pago[]>;
    findOne(id: string): Promise<import("./entities/pago.entity").Pago | null>;
    update(id: string, updatePagoDto: UpdatePagoDto): Promise<import("./entities/pago.entity").Pago | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
