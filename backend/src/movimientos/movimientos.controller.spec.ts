import { Test, TestingModule } from '@nestjs/testing';
import { MovimientosController } from './movimientos.controller';
import { MovimientosService } from './movimientos.service';

describe('MovimientosController', () => {
  let controller: MovimientosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimientosController],
      providers: [MovimientosService],
    }).compile();

    controller = module.get<MovimientosController>(MovimientosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
