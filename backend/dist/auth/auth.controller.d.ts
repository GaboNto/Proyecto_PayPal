import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private authService;
    verifyEmail(token: string, res: Response): Promise<Response<any, Record<string, any>>>;
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
        banco: string;
        cuentas: import("../cuentas/entities/cuenta.entity").Cuenta[];
        destinatarios: import("../destinatarios/entities/destinatario.entity").Destinatario[];
        email_verificado: boolean;
        bepass: string;
        totpSecret: string;
        direccion: string;
        facturacion: string;
        twoFactorEnabled: boolean;
    }>;
    checkRut(rut: string): Promise<{
        exists: boolean;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    sendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
}
