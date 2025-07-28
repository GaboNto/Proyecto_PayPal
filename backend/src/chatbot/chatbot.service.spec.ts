/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from './chatbot.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pago } from 'src/pagos/entities/pago.entity';
import { User } from 'src/users/user.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ChatbotService', () => {
  let service: ChatbotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        { provide: getRepositoryToken(Pago), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Cuenta), useValue: { find: jest.fn() } },
      ],
    }).compile();

    service = module.get<ChatbotService>(ChatbotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return respuesta del modelo Gemini', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        candidates: [
          { content: { parts: [{ text: 'Hola, esta es la respuesta.' }] } }
        ]
      }
    });

    const prompt = 'Dame mi saldo';
    const result = await service.enviarMensaje(prompt);

    expect(result).toBe('Hola, esta es la respuesta.');
  });

  it('should return fallback message si no hay respuesta', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { candidates: [] }
    });

    const result = await service.enviarMensaje('...');

    expect(result).toBe('Sin respuesta del modelo.');
  });

  it('should throw InternalServerErrorException si falla Gemini', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Error de red'));

    await expect(service.enviarMensaje('algo')).rejects.toThrow('Error al comunicarse con Gemini');
  });

  it('debería formatear cuentas correctamente', () => {
    const cuentas = [
      {
        numero_cuenta: '123',
        tipo_cuenta: 'Ahorro',
        saldo: 1000,
        usuario: {
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
        },
      },
    ];

    const resultado = service.formatearCuentas(cuentas);
    expect(resultado).toContain('Número de cuenta: 123');
    expect(resultado).toContain('Juan Pérez');
  });
});
