/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    // Simula el método sendMail
    sendMailMock = jest.fn().mockResolvedValue({ messageId: '12345' });

    // Simula el transportador
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería enviar notificación de login', async () => {
    await service.sendLoginNotification('test@example.com', 'Juan');
    expect(sendMailMock).toHaveBeenCalled();
    expect(sendMailMock.mock.calls[0][0].to).toBe('test@example.com');
    expect(sendMailMock.mock.calls[0][0].subject).toContain('Notificación de inicio de sesión');
  });

  it('debería enviar notificación de transferencia', async () => {
    await service.sendTransferNotification('test@example.com', 'Juan', 'Pedro', 5000, new Date());
    expect(sendMailMock).toHaveBeenCalled();
    expect(sendMailMock.mock.calls[0][0].subject).toContain('Confirmación de transferencia');
  });

  it('debería enviar correo de recuperación de contraseña', async () => {
    const result = await service.sendPasswordResetEmail('test@example.com', 'Juan');
    expect(sendMailMock).toHaveBeenCalled();
    expect(result.messageId).toBe('12345');
  });

  it('debería enviar correo de verificación de email', async () => {
    const result = await service.sendEmailVerification('test@example.com', 'Juan');
    expect(sendMailMock).toHaveBeenCalled();
    expect(result.messageId).toBe('12345');
  });

  it('debería lanzar error si falla el envío de recuperación de contraseña', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('Falló envío'));

    await expect(service.sendPasswordResetEmail('fail@test.com', 'Juan')).rejects.toThrow(
      'No se pudo enviar el correo de restablecimiento de contraseña.',
    );
  });
});
