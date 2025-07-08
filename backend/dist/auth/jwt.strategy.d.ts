import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): unknown;
}
export {};
