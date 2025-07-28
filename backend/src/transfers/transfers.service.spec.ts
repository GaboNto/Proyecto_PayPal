/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Transferencia } from './entities/transferencia.entity';
import { UsuarioExterno } from './entities/usuario-externo.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { HistorialSaldos } from './entities/historial-saldos';
import { EmailService } from '../email/email.service';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('TransfersService', () => {
  let service: TransfersService;
  let userRepo: Repository<User>;
  let cuentaRepo: Repository<Cuenta>;
  let transferenciaRepo: Repository<Transferencia>;
  let externoRepo: Repository<UsuarioExterno>;
  let historialRepo: Repository<HistorialSaldos>;
  let dataSource: DataSource;
  let emailService: EmailService;

  const mockUser = {
    id_usuario: 1,
    bepass: bcrypt.hashSync('1234', 10),
    email: 'test@mail.com',
    nombre: 'Juan',
    apellido: 'Meneses',
    rut: '12345678-9'
  } as User;

  const mockCuentaOrigen = {
    id: 1,
    numero_cuenta: '111',
    saldo: 10000,
    usuario: mockUser
  } as Cuenta;

  const mockCuentaDestino = {
    id: 2,
    numero_cuenta: '222',
    saldo: 5000,
    usuario: mockUser
  } as Cuenta;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      findOne: jest.fn(),
      save: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        { provide: getRepositoryToken(User), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(Transferencia), useValue: { create: jest.fn(), save: jest.fn() } },
        { provide: getRepositoryToken(UsuarioExterno), useValue: { create: jest.fn(), save: jest.fn() } },
        { provide: getRepositoryToken(Cuenta), useValue: { find: jest.fn(), findOne: jest.fn() } },
        { provide: getRepositoryToken(HistorialSaldos), useValue: { create: jest.fn(), save: jest.fn() } },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          }
        },
        {
          provide: EmailService,
          useValue: {
            sendTransferNotification: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    userRepo = module.get(getRepositoryToken(User));
    cuentaRepo = module.get(getRepositoryToken(Cuenta));
    transferenciaRepo = module.get(getRepositoryToken(Transferencia));
    externoRepo = module.get(getRepositoryToken(UsuarioExterno));
    historialRepo = module.get(getRepositoryToken(HistorialSaldos));
    dataSource = module.get(DataSource);
    emailService = module.get(EmailService);
  });

  describe('transferBetweenOwnAccounts', () => {
    it('debería transferir correctamente entre cuentas propias', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockCuentaOrigen)
        .mockResolvedValueOnce(mockCuentaDestino);

      mockQueryRunner.manager.save.mockResolvedValue({});

      const dto = {
        cuentaOrigenId: 1,
        cuentaDestinoId: 2,
        monto: 1000,
        bepass: '1234'
      };

      const result = await service.transferBetweenOwnAccounts(dto, 1);
      expect(result).toEqual({ message: 'Transferencia entre tus cuentas realizada con éxito.' });
    });

    it('debería lanzar error si bepass es incorrecto', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(
        service.transferBetweenOwnAccounts({
          cuentaOrigenId: 1,
          cuentaDestinoId: 2,
          monto: 1000,
          bepass: 'wrongpass'
        }, 1)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar error si la cuenta de origen no tiene saldo suficiente', async () => {
      const cuentaSinSaldo = { ...mockCuentaOrigen, saldo: 500 };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(cuentaSinSaldo)
        .mockResolvedValueOnce(mockCuentaDestino);

      await expect(
        service.transferBetweenOwnAccounts({
          cuentaOrigenId: 1,
          cuentaDestinoId: 2,
          monto: 1000,
          bepass: '1234'
        }, 1)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('create (externa)', () => {
    it('debería procesar una transferencia externa exitosamente', async () => {
      const dto = {
        monto: 1000,
        banco_destino: 'Banco Prueba',
        rut_destinatario: '12345678-0',
        nombre_destinatario: 'Destinatario',
        tipo_cuenta: 'corriente',
        numero_cuenta: '333',
        cuentaOrigenId: 1,
        bepass: '1234'
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      mockQueryRunner.manager.findOne.mockResolvedValueOnce(mockCuentaOrigen);
      mockQueryRunner.manager.findOne.mockResolvedValueOnce(null);

      externoRepo.create = jest.fn().mockReturnValue({ ...dto, saldo: 0 });
      mockQueryRunner.manager.save.mockResolvedValue({});

      const result = await service.create(dto, 1);
      expect(result).toEqual({ message: 'Transferencia realizada con éxito' });
    });
  });
});
