import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    responder(req: any, body: SendMessageDto): Promise<{
        respuesta: string;
    }>;
}
