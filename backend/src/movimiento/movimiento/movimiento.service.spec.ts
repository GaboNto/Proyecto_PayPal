import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoService } from './movimiento.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movimiento } from './movimiento.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from 'src/users/user.entity';

describe('MovimientoService', () => {
  let service: MovimientoService;
  let movimientoRepo: Repository<Movimiento>;
  let cuentaRepo: Repository<Cuenta>;

  const mockCuenta: Partial<Cuenta> = {
    id: 1,
    saldo: 1000,
    usuario: {} as User,
    numero_cuenta: 'CL1234567890',
    tipo_cuenta: 'Cuenta Corriente',
    fecha_apertura: new Date(),
    movimientos: [],
    cards: [],
  };

  beforeEach(async () => {
    const mockMovimientoRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    const mockCuentaRepo = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovimientoService,
        { provide: getRepositoryToken(Movimiento), useValue: mockMovimientoRepo },
        { provide: getRepositoryToken(Cuenta), useValue: mockCuentaRepo },
      ],
    }).compile();

    service = module.get<MovimientoService>(MovimientoService);
    movimientoRepo = module.get(getRepositoryToken(Movimiento));
    cuentaRepo = module.get(getRepositoryToken(Cuenta));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería lanzar error si la cuenta no existe', async () => {
    jest.spyOn(cuentaRepo, 'findOne').mockResolvedValue(null);

    await expect(
      service.createMovimiento(1, { amount: 1000, type: 'deposito' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería lanzar error si el tipo es inválido', async () => {
    jest.spyOn(cuentaRepo, 'findOne').mockResolvedValue(mockCuenta as Cuenta);

    await expect(
      service.createMovimiento(1, { amount: 1000, type: 'invalido' as any }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar error si el retiro excede el saldo', async () => {
    const lowSaldoCuenta = { ...mockCuenta, saldo: 500 };
    jest.spyOn(cuentaRepo, 'findOne').mockResolvedValue(lowSaldoCuenta as Cuenta);

    await expect(
      service.createMovimiento(1, { amount: 1000, type: 'retiro' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería crear un movimiento de depósito correctamente', async () => {
    jest.spyOn(cuentaRepo, 'findOne').mockResolvedValue(mockCuenta as Cuenta);
    jest.spyOn(movimientoRepo, 'create').mockReturnValue({ id: 1 } as Movimiento);
    jest.spyOn(movimientoRepo, 'save').mockResolvedValue({ id: 1 } as Movimiento);

    const result = await service.createMovimiento(1, { amount: 1000, type: 'deposito' });

    expect(result).toEqual({ id: 1 });
    expect(movimientoRepo.create).toHaveBeenCalled();
    expect(movimientoRepo.save).toHaveBeenCalled();
    expect(cuentaRepo.update).toHaveBeenCalledWith(1, { saldo: 2000 });
  });
});
