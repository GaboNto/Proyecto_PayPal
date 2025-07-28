/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MovimientosService } from './movimientos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transferencia } from '../transfers/entities/transferencia.entity';
import { Pago } from '../pagos/entities/pago.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

describe('MovimientosService', () => {
  let service: MovimientosService;

  let mockTransferenciaRepo: Partial<Record<keyof Repository<Transferencia>, jest.Mock>>;
  let mockPagoRepo: Partial<Record<keyof Repository<Pago>, jest.Mock>>;
  let mockCuentaRepo: Partial<Record<keyof Repository<Cuenta>, jest.Mock>>;
  let mockUserRepo: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    mockTransferenciaRepo = {
      find: jest.fn(),
    };
    mockPagoRepo = {
      find: jest.fn(),
    };
    mockCuentaRepo = {
      findOneBy: jest.fn(),
    };
    mockUserRepo = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovimientosService,
        { provide: getRepositoryToken(Transferencia), useValue: mockTransferenciaRepo },
        { provide: getRepositoryToken(Pago), useValue: mockPagoRepo },
        { provide: getRepositoryToken(Cuenta), useValue: mockCuentaRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<MovimientosService>(MovimientosService);
  });

  it('debería retornar historial con pagos y transferencias correctamente formateadas', async () => {
    const userId = 1;

    const pagos = [
      {
        fecha: new Date('2025-07-01T12:00:00Z'),
        descripcion: 'Pago Netflix',
        monto: 8000,
        categoria: 'Entretenimiento',
      },
    ];

    const transferencias = [
      {
        fecha: new Date('2025-07-02T14:00:00Z'),
        monto: 5000,
        usuario_id_origen: 1,
        id_usuario_destino: 2,
      },
      {
        fecha: new Date('2025-07-03T15:00:00Z'),
        monto: 7000,
        usuario_id_origen: 3,
        id_usuario_destino: 1,
      },
    ];

    (mockPagoRepo.find as jest.Mock).mockResolvedValue(pagos);
    (mockTransferenciaRepo.find as jest.Mock).mockResolvedValue(transferencias);
    (mockUserRepo.findOneBy as jest.Mock).mockImplementation(({ id_usuario }) => {
      return Promise.resolve({ nombre: `Usuario${id_usuario}` });
    });

    const result = await service.obtenerMovimientosPorUsuario(userId);

    expect(result).toEqual([
      {
        fecha: new Date('2025-07-03T15:00:00Z'),
        descripcion: 'Transferencia de Usuario3',
        categoria: 'Transferencia',
        abono: 7000,
      },
      {
        fecha: new Date('2025-07-02T14:00:00Z'),
        descripcion: 'Transferencia a Usuario2',
        categoria: 'Transferencia',
        abono: -5000,
      },
      {
        fecha: new Date('2025-07-01T12:00:00Z'),
        descripcion: 'Pago Netflix',
        categoria: 'Entretenimiento',
        abono: -8000,
      },
    ]);
  });
});
