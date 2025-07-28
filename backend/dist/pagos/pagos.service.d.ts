import { CreatePagoDto } from './dto/create-pago.dto';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import { CreateCreditCardPaymentDto } from './dto/create-credit-card-payment.dto';
import { Card } from 'src/card/card.entity';
export declare class PagosService {
    private readonly pagosRepository;
    private readonly cuentaRepository;
    private cardRepository;
    constructor(pagosRepository: Repository<Pago>, cuentaRepository: Repository<Cuenta>, cardRepository: Repository<Card>);
    create(createPagoDto: CreatePagoDto): Promise<{
        message: string;
        pago: Pago;
        nuevoSaldo: number;
    }>;
    createCreditCardPayment(createCreditCardPaymentDto: CreateCreditCardPaymentDto): Promise<{
        message: string;
        pago: Pago;
        nuevoSaldo: number;
    }>;
}
