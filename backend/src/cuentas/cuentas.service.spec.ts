import { Test, TestingModule } from '@nestjs/testing';
import { CuentasService } from './cuentas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { User } from '../users/user.entity';
import { Card } from '../card/card.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CuentasService', () => {
  let service: CuentasService;

  const mockCuentaRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };
  const mockUserRepo = {
    findOne: jest.fn(),
  };
  const mockCardRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentasService,
        { provide: getRepositoryToken(Cuenta), useValue: mockCuentaRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Card), useValue: mockCardRepo },
      ],
    }).compile();

    service = module.get<CuentasService>(CuentasService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if user not found', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    await expect(service.create(1, 'Cuenta Corriente')).rejects.toThrow(NotFoundException);
  });

  it('should throw if user already has account of that type', async () => {
    mockUserRepo.findOne.mockResolvedValue({ id_usuario: 1 });
    mockCuentaRepo.findOne.mockResolvedValue({ tipo_cuenta: 'Cuenta Corriente' });

    await expect(service.create(1, 'Cuenta Corriente')).rejects.toThrow(BadRequestException);
  });

  it('should create account and associated card', async () => {
    const user = { id_usuario: 1 };
    const cuentaMock = { id: 'uuid', tipo_cuenta: 'Cuenta Corriente', saldo: 0 };
    const cardMock = { id: 'card-id' };

    mockUserRepo.findOne.mockResolvedValue(user);
    mockCuentaRepo.findOne.mockResolvedValue(null);
    mockCuentaRepo.create.mockReturnValue(cuentaMock);
    mockCuentaRepo.save.mockResolvedValue(cuentaMock);
    mockCardRepo.create.mockReturnValue(cardMock);
    mockCardRepo.save.mockResolvedValue(cardMock);

    const result = await service.create(1, 'Cuenta Corriente');

    expect(mockCuentaRepo.create).toHaveBeenCalled();
    expect(mockCardRepo.create).toHaveBeenCalled();
    expect(result).toEqual(cuentaMock);
  });

  it('should return accounts by userId', async () => {
    const cuentas = [{ id: 'uuid', tipo_cuenta: 'Ahorro' }];
    mockCuentaRepo.find.mockResolvedValue(cuentas);

    const result = await service.findByUserId(1);
    expect(result).toEqual(cuentas);
  });
});
