import { EmailService } from './email.service';
import { SendPasswordResetEmailDto } from './dto/send-password-reset-email.dto';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendPasswordResetEmail(sendResetDto: SendPasswordResetEmailDto): Promise<{
        message: string;
    }>;
}
