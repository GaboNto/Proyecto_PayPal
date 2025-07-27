import { MovimientosService } from './movimientos.service';
import { MovimientoHistorialDto } from './dto/movimiento-historial.dto';
export declare class MovimientosController {
    private readonly movimientosService;
    constructor(movimientosService: MovimientosService);
    getMovimientos(req: any): Promise<MovimientoHistorialDto[]>;
    obtenerHistorial(req: any): Promise<MovimientoHistorialDto[]>;
}
