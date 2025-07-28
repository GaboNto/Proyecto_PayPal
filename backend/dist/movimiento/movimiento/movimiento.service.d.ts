import { Repository } from 'typeorm';
import { Movimiento } from './movimiento.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
export declare class MovimientoService {
    private readonly movimientoRepository;
    private readonly cuentaRepository;
    constructor(movimientoRepository: Repository<Movimiento>, cuentaRepository: Repository<Cuenta>);
    createMovimiento(cuentaId: number, createMovimientoDto: CreateMovimientoDto): Promise<Movimiento>;
    findMovimientosByCuentaId(cuentaId: number): Promise<Movimiento[]>;
}
