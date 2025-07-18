import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { Card } from 'src/card/card.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private usersRepository;
    private cuentasRepository;
    private cardRepository;
    private transporter;
    private recoveryTokens;
    constructor(usersService: UsersService, jwtService: JwtService, usersRepository: Repository<User>, cuentasRepository: Repository<Cuenta>, cardRepository: Repository<Card>);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): unknown;
    register(createUserDto: CreateUserDto): unknown;
    checkRutExists(rut: string): Promise<{
        exists: boolean;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any>;
    private sendRecoveryEmail;
}
