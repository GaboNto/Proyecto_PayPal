/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { CreateCreditCardPaymentDto } from './dto/create-credit-card-payment.dto';

describe('PagosController', () => {
  let controller: PagosController;
  let pagosService: PagosService;

  const mockPagosService = {
    create: jest.fn(),
    createCreditCardPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagosController],
      providers: [
        {
          provide: PagosService,
          useValue: mockPagosService,
        },
      ],
    }).compile();

    controller = module.get<PagosController>(PagosController);
    pagosService = module.get<PagosService>(PagosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call pagosService.create with the dto and return the result', async () => {
      const dto: CreatePagoDto = {
        monto: 100,
        descripcion: 'Pago de prueba',
        numeroCuenta: '123456789'
      };

      const expectedResult = { id: 1, ...dto, fecha: new Date().toISOString() };

      mockPagosService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(pagosService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createCreditCardPayment()', () => {
    it('should call pagosService.createCreditCardPayment with the dto and return the result', async () => {
const dto: CreateCreditCardPaymentDto = {
  numeroCuenta: '1234567890',
  monto: 10000,
  descripcion: 'Pago con tarjeta',
  cardNumber: '4111222233334444',
  cvv: '123',
  expirationDate: '12/28',
};


      const mockReq = {
        user: { sub: 123 }, // Si llegas a usar `req.user.sub`
      };

      const expectedResult = { id: 2, ...dto, fecha: new Date().toISOString() };

      mockPagosService.createCreditCardPayment.mockResolvedValue(expectedResult);

      const result = await controller.createCreditCardPayment(mockReq, dto);

      expect(pagosService.createCreditCardPayment).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
