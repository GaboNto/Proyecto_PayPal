import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MovimientosService } from 'src/movimientos/movimientos.service';
export declare class ChatbotController {
    private readonly movimientosService;
    private readonly chatbotService;
    constructor(movimientosService: MovimientosService, chatbotService: ChatbotService);
    responder(req: any, body: SendMessageDto): Promise<{
        respuesta: string;
    }>;
}
