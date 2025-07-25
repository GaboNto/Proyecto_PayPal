import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./user.entity").User>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<import("./user.entity").User>;
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
    requestDisable2FA(req: any): Promise<{
        message: string;
    }>;
    confirmDisable2FA(req: any, token: string): Promise<{
        message: string;
    }>;
    get2FAStatus(req: any): Promise<{
        isEnabled: boolean;
        hasBepass: boolean;
    }>;
}
