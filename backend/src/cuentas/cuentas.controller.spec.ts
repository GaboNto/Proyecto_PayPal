import { Test, TestingModule } from '@nestjs/testing';
import { CuentasController } from './cuentas.controller';
import { CuentasService } from './cuentas.service';

describe('CuentasController', () => {
  let controller: CuentasController;
  let service: CuentasService;

  const mockCuentasService = {
    create: jest.fn(),
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuentasController],
      providers: [
        {
          provide: CuentasService,
          useValue: mockCuentasService,
        },
      ],
    }).compile();

    controller = module.get<CuentasController>(CuentasController);
    service = module.get<CuentasService>(CuentasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new account', async () => {
    const req = { user: { sub: 1 } };
    const body = { tipo_cuenta: 'Cuenta Corriente' };
    const expected = { id: 'uuid', tipo_cuenta: 'Cuenta Corriente', saldo: 0 };

    mockCuentasService.create.mockResolvedValue(expected);

    const result = await controller.createAccount(req, body);

    expect(service.create).toHaveBeenCalledWith(1, body.tipo_cuenta);
    expect(result).toEqual(expected);
  });

  it('should return user accounts', async () => {
    const req = { user: { sub: 1 } };
    const cuentas = [{ id: 'uuid', tipo_cuenta: 'Cuenta Corriente', saldo: 1000 }];
    mockCuentasService.findByUserId.mockResolvedValue(cuentas);

    const result = await controller.findUserAccounts(req);

    expect(service.findByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(cuentas);
  });
});
