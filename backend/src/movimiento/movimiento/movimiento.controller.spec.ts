import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoController } from './movimiento.controller';

describe('MovimientoController', () => {
  let controller: MovimientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimientoController],
    }).compile();

    controller = module.get<MovimientoController>(MovimientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
