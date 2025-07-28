import { Repository } from 'typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { User } from '../users/user.entity';
import { Card } from '../card/card.entity';
export declare class CuentasService {
    private cuentasRepository;
    private usersRepository;
    private cardRepository;
    constructor(cuentasRepository: Repository<Cuenta>, usersRepository: Repository<User>, cardRepository: Repository<Card>);
    create(userId: number, tipo_cuenta: string): Promise<Cuenta>;
    findByUserId(userId: number): Promise<Cuenta[]>;
}
