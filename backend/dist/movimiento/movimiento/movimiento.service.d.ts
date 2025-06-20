import { Repository } from 'typeorm';
import { Movimiento } from './movimiento.entity';
import { SaldoService } from 'src/saldo/saldo/saldo.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
export declare class MovimientoService {
    private readonly movimientoRepository;
    private readonly saldoService;
    constructor(movimientoRepository: Repository<Movimiento>, saldoService: SaldoService);
    createMovimiento(saldoId: number, createMovimientoDto: CreateMovimientoDto): Promise<Movimiento>;
    findMovimientosBySaldoId(saldoId: number): Promise<Movimiento[]>;
}
