import { Repository } from 'typeorm';
import { Saldo } from './saldo.entity';
import { User } from 'src/users/user.entity';
export declare class SaldoService {
    private readonly saldoRepository;
    constructor(saldoRepository: Repository<Saldo>);
    createInitialSaldo(user: User, initialAmount: number): Promise<Saldo>;
    findSaldoByUserId(userId: number): Promise<Saldo | null>;
    updateSaldo(saldoId: number, newAmount: number): Promise<Saldo | null>;
    findSaldoById(id: number): Promise<Saldo | null>;
}
