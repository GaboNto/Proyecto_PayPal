import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): unknown;
    register(createUserDto: CreateUserDto): unknown;
    checkRut(rut: string): unknown;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): unknown;
}
