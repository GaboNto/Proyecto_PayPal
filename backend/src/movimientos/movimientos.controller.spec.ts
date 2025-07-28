/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MovimientosController } from './movimientos.controller';
import { MovimientosService } from './movimientos.service';

describe('MovimientosController', () => {
  let controller: MovimientosController;
  let movimientosService: MovimientosService;

  const mockMovimientosService = {
    obtenerMovimientosPorUsuario: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimientosController],
      providers: [
        {
          provide: MovimientosService,
          useValue: mockMovimientosService,
        },
      ],
    }).compile();

    controller = module.get<MovimientosController>(MovimientosController);
    movimientosService = module.get<MovimientosService>(MovimientosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovimientos', () => {
    it('debería retornar movimientos desde el servicio', async () => {
      const userId = 1;
      const req = { user: { sub: userId } };
      const mockData = [{ descripcion: 'Pago', abono: -1000, fecha: new Date(), categoria: 'Servicios' }];

      mockMovimientosService.obtenerMovimientosPorUsuario.mockResolvedValue(mockData);

      const result = await controller.getMovimientos(req);

      expect(movimientosService.obtenerMovimientosPorUsuario).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockData);
    });
  });

  describe('obtenerHistorial', () => {
    it('debería retornar historial desde el servicio', async () => {
      const userId = 1;
      const req = { user: { sub: userId } };
      const mockHistorial = [{ descripcion: 'Transferencia', abono: 5000, fecha: new Date(), categoria: 'Transferencia' }];

      mockMovimientosService.obtenerMovimientosPorUsuario.mockResolvedValue(mockHistorial);

      const result = await controller.obtenerHistorial(req);

      expect(movimientosService.obtenerMovimientosPorUsuario).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockHistorial);
    });
  });
});
