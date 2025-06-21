import { Test, TestingModule } from '@nestjs/testing';
import { SaldoController } from './saldo.controller';

describe('SaldoController', () => {
  let controller: SaldoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaldoController],
    }).compile();

    controller = module.get<SaldoController>(SaldoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
