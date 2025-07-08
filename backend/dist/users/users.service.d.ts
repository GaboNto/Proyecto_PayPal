import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findUserProfile(userId: number): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<User>;
    findById(id: number): Promise<User>;
    verifyBepass(userId: number, verifyBepassDto: VerifyBepassDto): Promise<{
        success: boolean;
    }>;
    setBepass(userId: number, setBepassDto: SetBepassDto): Promise<{
        message: string;
    }>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    save(user: User): Promise<User>;
}
