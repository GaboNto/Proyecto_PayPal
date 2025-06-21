import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SaldoService } from 'src/saldo/saldo/saldo.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
export declare class UsersService {
    private repo;
    private readonly saldoService;
    constructor(repo: Repository<User>, saldoService: SaldoService);
    create(userData: CreateUserDto): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(id: number): Promise<User | null>;
}
