import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        accessToken: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id_usuario: number;
        nombre: string;
        apellido: string;
        email: string;
        fecha_nacimiento: string;
        pais: string;
        ciudad: string;
        rut: string;
        direccion: string;
        facturacion: string;
        banco: string;
        cuentas: import("../cuentas/entities/cuenta.entity").Cuenta[];
        destinatarios: import("../destinatarios/entities/destinatario.entity").Destinatario[];
        bepass: string;
        totpSecret?: string;
        emailVerificado: boolean;
        twoFAEnabled: boolean;
    }>;
    checkRut(rut: string): Promise<{
        exists: boolean;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
}
