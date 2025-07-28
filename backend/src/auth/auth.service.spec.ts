/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { Card } from 'src/card/card.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';

const mockUser = {
  id_usuario: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  nombre: 'Juan',
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;

  const mockUsersRepository = {
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => ({ id_usuario: 1, ...user })),
  };

  const mockCuentaRepo = {
    create: jest.fn().mockReturnValue({}),
    save: jest.fn().mockResolvedValue({}),
  };

  const mockCardRepo = {
    create: jest.fn().mockReturnValue({}),
    save: jest.fn().mockResolvedValue({}),
  };

  const mockUsersService = {};

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('fake-jwt-token'),
  };

  const mockEmailService = {
    sendLoginNotification: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: getRepositoryToken(Cuenta), useValue: mockCuentaRepo },
        { provide: getRepositoryToken(Card), useValue: mockCardRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toHaveProperty('email');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if credentials are invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser('test@example.com', 'wrong');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and send login notification', async () => {
      const result = await service.login(mockUser);
      expect(result.accessToken).toBe('fake-jwt-token');
      expect(mockEmailService.sendLoginNotification).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.nombre,
      );
    });
  });
});
