/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { MovimientosService } from 'src/movimientos/movimientos.service';
import { SendMessageDto } from './dto/send-message.dto';

describe('ChatbotController', () => {
  let controller: ChatbotController;
  let chatbotService: ChatbotService;
  let movimientosService: MovimientosService;

  beforeEach(async () => {
    const mockChatbotService = {
      enviarMensaje: jest.fn().mockResolvedValue('respuesta generada'),
      obtenerCuentasPorUsuario: jest.fn().mockResolvedValue([]),
      formatearCuentas: jest.fn().mockReturnValue('cuentas formateadas'),
    };

    const mockMovimientosService = {
      obtenerMovimientosPorUsuario: jest.fn().mockResolvedValue([{ id: 1, monto: 5000 }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotController],
      providers: [
        { provide: ChatbotService, useValue: mockChatbotService },
        { provide: MovimientosService, useValue: mockMovimientosService },
      ],
    }).compile();

    controller = module.get<ChatbotController>(ChatbotController);
    chatbotService = module.get<ChatbotService>(ChatbotService);
    movimientosService = module.get<MovimientosService>(MovimientosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call chatbotService and return respuesta', async () => {
    const dto: SendMessageDto = { texto: '¿Cuál es mi saldo?' };
    const req = { user: { sub: 1 } };

    const respuesta = await controller.responder(req, dto);

    expect(chatbotService.obtenerCuentasPorUsuario).toHaveBeenCalledWith(1);
    expect(movimientosService.obtenerMovimientosPorUsuario).toHaveBeenCalledWith(1);
    expect(chatbotService.enviarMensaje).toHaveBeenCalled();
    expect(respuesta).toEqual({ respuesta: 'respuesta generada' });
  });
});
