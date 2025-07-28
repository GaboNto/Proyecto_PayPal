/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { CreateInternalTransferDto } from './dto/create-internal-transfer.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { NotFoundException } from '@nestjs/common';

describe('TransfersController', () => {
  let controller: TransfersController;
  let service: TransfersService;

  const mockTransfersService = {
    transferBetweenOwnAccounts: jest.fn(),
    create: jest.fn(),
    getUserHistory: jest.fn(),
    obtenerHistorialPorUsuario: jest.fn(),
    obtenerTipoYSaldoPorNumeroCuenta: jest.fn(),
  };

  const mockRequest = {
    user: { sub: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        {
          provide: TransfersService,
          useValue: mockTransfersService,
        },
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
    service = module.get<TransfersService>(TransfersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('transferBetweenOwnAccounts', () => {
    it('debería llamar al servicio y retornar mensaje', async () => {
      const dto: CreateInternalTransferDto = {
        cuentaOrigenId: 1,
        cuentaDestinoId: 2,
        monto: 1000,
        bepass: '1234',
      };

      const mockResponse = { message: 'Transferencia realizada con éxito' };
      mockTransfersService.transferBetweenOwnAccounts.mockResolvedValue(mockResponse);

      const result = await controller.transferBetweenOwnAccounts(dto, mockRequest);
      expect(result).toEqual(mockResponse);
      expect(service.transferBetweenOwnAccounts).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('create (externa)', () => {
    it('debería llamar al servicio y retornar mensaje', async () => {
      const dto: CreateTransferDto = {
        monto: 5000,
        banco_destino: 'Banco X',
        rut_destinatario: '12345678-9',
        nombre_destinatario: 'Juan Pérez',
        tipo_cuenta: 'corriente',
        numero_cuenta: '1234567890',
        bepass: '1234',
        cuentaOrigenId: 1,
      };

      const mockResponse = { message: 'Transferencia realizada con éxito' };
      mockTransfersService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(dto, mockRequest);
      expect(result).toEqual(mockResponse);
      expect(service.create).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('getHistory', () => {
    it('debería retornar historial filtrado', async () => {
      const mockHistorial = [{ id: 1, monto: 1000 }];
      mockTransfersService.getUserHistory.mockResolvedValue(mockHistorial);

      const result = await controller.getHistory(mockRequest, '2025-01-01', '2025-12-31');
      expect(result).toEqual(mockHistorial);
      expect(service.getUserHistory).toHaveBeenCalledWith(1, '2025-01-01', '2025-12-31');
    });
  });

  describe('obtenerHistorialUsuario', () => {
    it('debería retornar historial simplificado', async () => {
      const mockHistorial = [{ id: 1, saldo: 1500 }];
      mockTransfersService.obtenerHistorialPorUsuario.mockResolvedValue(mockHistorial);

      const result = await controller.obtenerHistorialUsuario(mockRequest);
      expect(result).toEqual(mockHistorial);
      expect(service.obtenerHistorialPorUsuario).toHaveBeenCalledWith(1);
    });
  });

  describe('obtenerTipoYSaldo', () => {
    it('debería retornar tipo y saldo si existe', async () => {
      const mockData = { tipoCuenta: 'Cuenta Corriente', saldo: 1500000 };
      mockTransfersService.obtenerTipoYSaldoPorNumeroCuenta.mockResolvedValue(mockData);

      const result = await controller.obtenerTipoYSaldo('123456789');
      expect(result).toEqual(mockData);
      expect(service.obtenerTipoYSaldoPorNumeroCuenta).toHaveBeenCalledWith('123456789');
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockTransfersService.obtenerTipoYSaldoPorNumeroCuenta.mockResolvedValue({ tipoCuenta: null, saldo: null });

      await expect(controller.obtenerTipoYSaldo('999')).rejects.toThrow(NotFoundException);
    });
  });
});
