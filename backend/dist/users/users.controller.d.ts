import { UsersService } from './users.service';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./user.entity").User>;
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
        qr: any;
    }>;
    verify2FA(req: any, code: string): Promise<{
        success: boolean;
    }>;
}
