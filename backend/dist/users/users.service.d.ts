import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
export declare class UsersService {
    private usersRepository;
    private disable2FATokens;
    constructor(usersRepository: Repository<User>);
    updateUserProfile(userId: number, updateUserDto: Partial<User>): Promise<any>;
    findUserProfile(userId: number): Promise<User | null>;
    findUserByEmail(email: string): any;
    create(createUserDto: CreateUserDto): Promise<any>;
    findById(id: number): Promise<any>;
    verifyBepass(userId: number, verifyBepassDto: VerifyBepassDto): Promise<{
        success: boolean;
    }>;
    setBepass(userId: number, setBepassDto: SetBepassDto): Promise<{
        message: string;
    }>;
    save(user: User): Promise<any>;
    requestDisable2FA(userId: number): Promise<{
        message: string;
    }>;
    confirmDisable2FA(userId: number, token: string): Promise<{
        message: string;
    }>;
    private sendDisable2FAEmail;
}
