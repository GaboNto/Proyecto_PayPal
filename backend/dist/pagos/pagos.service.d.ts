import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
export declare class PagosService {
    private readonly pagosRepository;
    constructor(pagosRepository: Repository<Pago>);
    create(createPagoDto: CreatePagoDto): Promise<{
        message: string;
        pago: Pago;
    }>;
    findAll(): Promise<Pago[]>;
    findOne(id: number): Promise<Pago | null>;
    update(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago | null>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
