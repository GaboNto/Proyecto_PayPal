import { MovimientosService } from './movimientos.service';
export declare class MovimientosController {
    private readonly movimientosService;
    constructor(movimientosService: MovimientosService);
    getMovimientos(req: any): Promise<import("./dto/movimiento-historial.dto").MovimientoHistorialDto[]>;
    obtenerHistorial(req: any): Promise<import("./dto/movimiento-historial.dto").MovimientoHistorialDto[]>;
}
