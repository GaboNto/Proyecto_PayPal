import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { CreateCreditCardPaymentDto } from './dto/create-credit-card-payment.dto';
export declare class PagosController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
    create(createPagoDto: CreatePagoDto): Promise<{
        message: string;
        pago: import("./entities/pago.entity").Pago;
        nuevoSaldo: number;
    }>;
    createCreditCardPayment(req: any, createCreditCardPaymentDto: CreateCreditCardPaymentDto): Promise<{
        message: string;
        pago: import("./entities/pago.entity").Pago;
        nuevoSaldo: number;
    }>;
}
