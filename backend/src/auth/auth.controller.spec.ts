/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from 'src/email/email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let emailService: EmailService;
  

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    checkRutExists: jest.fn(),
  };

  const mockEmailService = {
    sendPasswordResetEmail: jest.fn(),
    sendEmailVerification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT access token', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = { access_token: 'mocked.jwt.token' };

      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login({ user: mockUser } as any);
      expect(result).toEqual(mockToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
        const dto: CreateUserDto = {
            nombre: 'felipe',
            apellido: 'cayupi',
            rut: '12345678-9',
            email: 'flc@correo.com',
            password: '123456',
            fecha_nacimiento: '1998-01-01',
            ciudad: 'Arica',
            pais: 'Chile'
        };


      const mockResponse = { message: 'Usuario creado' };
      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(dto);
      expect(result).toEqual(mockResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('checkRut', () => {
    it('should return whether a rut exists', async () => {
      mockAuthService.checkRutExists.mockResolvedValue({ exists: true });

      const result = await controller.checkRut('12345678-9');
      expect(result).toEqual({ exists: true });
      expect(mockAuthService.checkRutExists).toHaveBeenCalledWith('12345678-9');
    });
  });

  describe('forgotPassword', () => {
    it('should send a password reset email', async () => {
      const dto: ForgotPasswordDto = {
        email: 'juan@example.com',
        nombre: 'Juan',
      };

      const result = await controller.forgotPassword(dto);
      expect(result).toEqual({
        message:
          'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.',
      });
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(dto.email, dto.nombre);
    });
  });

  describe('sendEmailVerification', () => {
    it('should send a verification email', async () => {
      const dto: ForgotPasswordDto = {
        email: 'juan@example.com',
        nombre: 'Juan',
      };

      const result = await controller.sendEmailVerification(dto);
      expect(result).toEqual({
        message:
          'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.',
      });
      expect(emailService.sendEmailVerification).toHaveBeenCalledWith(dto.email, dto.nombre);
    });
  });
});
