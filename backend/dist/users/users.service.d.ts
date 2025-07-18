import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findUserProfile(userId: number): Promise<User | null>;
    findUserByEmail(email: string): any;
    create(createUserDto: CreateUserDto): unknown;
    findById(id: number): unknown;
    verifyBepass(userId: number, verifyBepassDto: VerifyBepassDto): Promise<{
        success: boolean;
    }>;
    setBepass(userId: number, setBepassDto: SetBepassDto): Promise<{
        message: string;
    }>;
    save(user: User): unknown;
}
