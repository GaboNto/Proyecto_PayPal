import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ResetToken } from '../auth/entities/reset-token.entity';
export declare class EmailService {
    private usersRepository;
    private resetTokenRepository;
    constructor(usersRepository: Repository<User>, resetTokenRepository: Repository<ResetToken>);
    private transporter;
    sendLoginNotification(to: string, nombre: string): Promise<void>;
    sendTransferNotification(to: string, nombre: string, destinatario: string, monto: number, fecha: Date): Promise<void>;
    sendPasswordResetEmail(to: string): Promise<any>;
    sendEmailVerification(to: string, nombre: string): Promise<any>;
    validateResetToken(token: string): Promise<string | null>;
    resetPassword(token: string, newPassword: string): Promise<boolean>;
    verifyEmail(token: string): Promise<boolean>;
    cleanupExpiredTokens(): Promise<void>;
}
