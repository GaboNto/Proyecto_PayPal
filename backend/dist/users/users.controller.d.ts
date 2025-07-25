import { UsersService } from './users.service';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./user.entity").User>;
    getCurrentUser(req: any): Promise<{
        id_usuario: number;
        nombre: string;
        apellido: string;
        email: string;
        fecha_nacimiento: string;
        direccion: string;
        facturacion: string;
        email_verificado: boolean;
    }>;
    verifyBepass(req: any, verifyBepassDto: VerifyBepassDto): Promise<{
        success: boolean;
    }>;
    setBepass(req: any, setBepassDto: SetBepassDto): Promise<{
        message: string;
    }>;
    hasBepass(req: any): Promise<{
        hasBepass: boolean;
    }>;
    setup2FA(req: any): Promise<{
        secret: string;
        qr: string;
    }>;
    verify2FA(req: any, code: string): Promise<{
        success: boolean;
    }>;
}
