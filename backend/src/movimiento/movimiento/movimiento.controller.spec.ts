import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoController } from './movimiento.controller';
import { MovimientoService } from './movimiento.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

describe('MovimientoController', () => {
  let controller: MovimientoController;
  let servicio: MovimientoService;

  const mockMovimientoService = {
    createMovimiento: jest.fn(),
    findMovimientosByCuentaId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimientoController],
      providers: [
        {
          provide: MovimientoService,
          useValue: mockMovimientoService,
        },
      ],
    }).compile();

    controller = module.get<MovimientoController>(MovimientoController);
    servicio = module.get<MovimientoService>(MovimientoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear un movimiento', async () => {
    const cuentaId = 1;
    const dto: CreateMovimientoDto = { amount: 1000, type: 'deposito' };
    const mockResult = { id: 1, ...dto };

    mockMovimientoService.createMovimiento.mockResolvedValue(mockResult);

    const result = await controller.createMovimiento(cuentaId, dto);

    expect(servicio.createMovimiento).toHaveBeenCalledWith(cuentaId, dto);
    expect(result).toEqual(mockResult);
  });

  it('debería obtener los movimientos de una cuenta', async () => {
    const cuentaId = 1;
    const movimientos = [{ id: 1, amount: 500, type: 'retiro' }];
    mockMovimientoService.findMovimientosByCuentaId.mockResolvedValue(movimientos);

    const result = await controller.getMovimientosByCuentaId(cuentaId);

    expect(servicio.findMovimientosByCuentaId).toHaveBeenCalledWith(cuentaId);
    expect(result).toEqual(movimientos);
  });
});
