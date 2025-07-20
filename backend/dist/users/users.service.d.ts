import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
export declare class UsersService {
    private usersRepository;
    private disable2FATokens;
    constructor(usersRepository: Repository<User>);
    updateUserProfile(userId: number, updateUserDto: Partial<User>): Promise<User>;
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
    save(user: User): Promise<User>;
    requestDisable2FA(userId: number): Promise<{
        message: string;
    }>;
    confirmDisable2FA(userId: number, token: string): Promise<{
        message: string;
    }>;
    private sendDisable2FAEmail;
}
