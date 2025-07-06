import { UsersService } from './users.service';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): unknown;
    verifyBepass(req: any, verifyBepassDto: VerifyBepassDto): Promise<{
        success: boolean;
    }>;
    setBepass(req: any, setBepassDto: SetBepassDto): Promise<{
        message: string;
    }>;
    hasBepass(req: any): unknown;
    setup2FA(req: any): unknown;
    verify2FA(req: any, code: string): unknown;
}
