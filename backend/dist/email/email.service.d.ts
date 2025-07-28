export declare class EmailService {
    private transporter;
    sendLoginNotification(to: string, nombre: string): Promise<void>;
    sendTransferNotification(to: string, nombre: string, destinatario: string, monto: number, fecha: Date): Promise<void>;
    sendPasswordResetEmail(to: string, nombre: string): Promise<any>;
    sendEmailVerification(to: string, nombre: string): Promise<any>;
}
