import { Repository } from 'typeorm';
import { Transferencia } from 'src/transfers/entities/transferencia.entity';
import { Pago } from 'src/pagos/entities/pago.entity';
import { MovimientoHistorialDto } from './dto/movimiento-historial.dto';
import { User } from 'src/users/user.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
export declare class MovimientosService {
    private transferenciasRepository;
    private pagoRepository;
    private userRepository;
    private cuentaRepository;
    constructor(transferenciasRepository: Repository<Transferencia>, pagoRepository: Repository<Pago>, userRepository: Repository<User>, cuentaRepository: Repository<Cuenta>);
    private obtenerNombreUsuario;
    private obtenerCuenta;
    obtenerMovimientosPorUsuario(idUsuario: number): Promise<MovimientoHistorialDto[]>;
}
