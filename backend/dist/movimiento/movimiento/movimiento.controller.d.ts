import { MovimientoService } from './movimiento.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
export declare class MovimientoController {
    private readonly movimientoService;
    constructor(movimientoService: MovimientoService);
    createMovimiento(cuentaId: number, createMovimientoDto: CreateMovimientoDto): unknown;
    getMovimientosByCuentaId(cuentaId: number): unknown;
}
