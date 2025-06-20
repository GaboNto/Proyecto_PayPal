import { MovimientoService } from './movimiento.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
export declare class MovimientoController {
    private readonly movimientoService;
    constructor(movimientoService: MovimientoService);
    createMovimiento(saldoId: number, createMovimientoDto: CreateMovimientoDto): Promise<import("./movimiento.entity").Movimiento>;
    getMovimientosBySaldoId(saldoId: number): Promise<import("./movimiento.entity").Movimiento[]>;
}
