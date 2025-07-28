/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PagosService } from './pagos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { Card } from '../card/card.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PagosService', () => {
  let service: PagosService;
  let pagoRepo: Repository<Pago>;
  let cuentaRepo: Repository<Cuenta>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        {
          provide: getRepositoryToken(Pago),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cuenta),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Card),
          useValue: {}, // No se usa en esta prueba
        },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
    pagoRepo = module.get<Repository<Pago>>(getRepositoryToken(Pago));
    cuentaRepo = module.get<Repository<Cuenta>>(getRepositoryToken(Cuenta));
  });

  it('debería crear un pago correctamente si la cuenta tiene saldo', async () => {
    // Arrange
    const mockDto = {
      monto: 100,
      descripcion: 'Pago de prueba',
      numeroCuenta: '12345678',
    };

    const mockUser = { id_usuario: 1 };
    const mockCuenta = {
      saldo: 200,
      numero_cuenta: '12345678',
      usuario: mockUser,
    };

    const mockPago = { id: 1, ...mockDto, categoria: 'servicios' };

    (cuentaRepo.findOne as jest.Mock).mockResolvedValue(mockCuenta);
    mockedAxios.post.mockResolvedValue({ data: { categoria: 'servicios' } });
    (pagoRepo.create as jest.Mock).mockReturnValue(mockPago);
    (pagoRepo.save as jest.Mock).mockResolvedValue(mockPago);
    (cuentaRepo.save as jest.Mock).mockResolvedValue({ ...mockCuenta, saldo: 100 });

    // Act
    const result = await service.create(mockDto);

    // Assert
    expect(cuentaRepo.findOne).toHaveBeenCalledWith({
      where: { numero_cuenta: mockDto.numeroCuenta },
      relations: ['usuario'],
    });

    expect(pagoRepo.create).toHaveBeenCalledWith({
      idusuario: mockUser.id_usuario,
      monto: mockDto.monto,
      descripcion: mockDto.descripcion,
      categoria: 'servicios',
    });

    expect(result).toEqual({
      message: 'Pago creado correctamente',
      pago: mockPago,
      nuevoSaldo: 100,
    });
  });
});
