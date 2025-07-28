/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import axios from 'axios';
import { CreateCreditCardPaymentDto } from './dto/create-credit-card-payment.dto';
import { Card } from 'src/card/card.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagosRepository: Repository<Pago>,
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    @InjectRepository(Card) // Inyecta el repositorio de Card
    private cardRepository: Repository<Card>,
  ) { }

  async create(createPagoDto: CreatePagoDto) {
    const { monto, descripcion, numeroCuenta } = createPagoDto;

    const cuenta = await this.cuentaRepository.findOne({
      where: { numero_cuenta: numeroCuenta },
      relations: ['usuario'],
    })

    if (!cuenta) {
      throw new NotFoundException('La cuenta no existe');
    }

    if (cuenta.saldo < monto) {
      throw new BadRequestException('Saldo insuficiente en la cuenta');
    }

    let categoria: string;

    try {
      const response = await axios.post('http://127.0.0.1:8000/predecir', {
        texto: descripcion,
      });
      categoria = response.data.categoria;
    } catch (error) {
      console.error('Error al conectar con FastAPI:', error.message);
      throw new InternalServerErrorException('Error al predecir categoría');
    }

    // Crear pago con idusuario desde relación usuario
    const nuevoPago = this.pagosRepository.create({
      idusuario: cuenta.usuario.id_usuario,
      monto,
      descripcion,
      categoria,
    });

    const pagoGuardado = await this.pagosRepository.save(nuevoPago);

    // Actualizar saldo
    cuenta.saldo -= monto;
    await this.cuentaRepository.save(cuenta);

    return {
      message: 'Pago creado correctamente',
      pago: pagoGuardado,
      nuevoSaldo: cuenta.saldo,
    };
  }

  async createCreditCardPayment(createCreditCardPaymentDto: CreateCreditCardPaymentDto) {
    const { monto, descripcion, cardNumber, cvv, expirationDate } =
      createCreditCardPaymentDto;

    // --- 1. Validar formato y longitud (ya cubierto por DTO y ValidationPipe) ---
    // Estas validaciones manuales son redundantes si confías en class-validator y transform: true
    // if (cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
    //   throw new BadRequestException('Número de tarjeta inválido.');
    // }
    // if (cvv.length < 3 || cvv.length > 4 || !/^\d{3,4}$/.test(cvv)) {
    //   throw new BadRequestException('CVV inválido.');
    // }
    // La validación de formato MM/YY también está en el DTO

    console.log(`Simulando validación y autorización de tarjeta: ${cardNumber}, ${expirationDate}, ${cvv}, Monto: ${monto}`);

    // --- Buscar la tarjeta y su cuenta asociada ---
    const card = await this.cardRepository.findOne({
      where: { cardNumber },
      relations: ['cuenta', 'cuenta.usuario'],
    });

    if (!card) {
      throw new NotFoundException('Tarjeta no encontrada o no asociada a ninguna cuenta.');
    }
    if (card.is_blocked) {
      throw new BadRequestException('La tarjeta está bloqueada.');
    }

    // --- NUEVA VALIDACIÓN: CVV y Fecha de Expiración coinciden con la tarjeta registrada ---
    if (card.cvv !== cvv) {
      throw new BadRequestException('CVV incorrecto para esta tarjeta.');
    }

    // Validar que la fecha de expiración proporcionada coincida con la de la tarjeta almacenada
    // Y que la tarjeta no haya expirado (esta es la lógica que ya tenías, pero ahora se aplica al 'card.expirationDate')
    if (card.expirationDate !== expirationDate) {
      throw new BadRequestException('Fecha de expiración incorrecta para esta tarjeta.');
    }

    const [storedMonth, storedYear] = card.expirationDate.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100; // Últimos dos dígitos del año actual
    const currentMonth = new Date().getMonth() + 1; // Mes actual (1-indexado)

    // Comprobar si la tarjeta ha expirado (año menor O mismo año y mes menor)
    if (storedYear < currentYear || (storedYear === currentYear && storedMonth < currentMonth)) {
      throw new BadRequestException('La tarjeta ha expirado.');
    }


    const cuentaAsociada = card.cuenta;

    if (!cuentaAsociada) {
      throw new InternalServerErrorException('La tarjeta no tiene una cuenta bancaria asociada.');
    }

    // --- 2. Verificar saldo suficiente en la cuenta asociada ---
    if (cuentaAsociada.saldo < monto) {
      throw new BadRequestException('Saldo insuficiente en la cuenta asociada a la tarjeta.');
    }

    // --- 3. Predecir categoría con FastAPI ---
    let categoria: string;
    try {
      const response = await axios.post('http://127.0.0.1:8000/predecir', {
        texto: descripcion,
      });
      categoria = response.data.categoria;
    } catch (error) {
      console.error('Error al conectar con FastAPI para predecir categoría:', error.message);
      throw new InternalServerErrorException('Error al predecir categoría del pago.');
    }

    // --- 4. Crear y guardar el registro de pago ---
    const nuevoPago = this.pagosRepository.create({
      idusuario: cuentaAsociada.usuario.id_usuario,
      monto,
      descripcion,
      categoria,
    });

    const pagoGuardado = await this.pagosRepository.save(nuevoPago);

    // --- 5. Actualizar saldo de la cuenta asociada ---
    cuentaAsociada.saldo -= monto;
    await this.cuentaRepository.save(cuentaAsociada);

    return {
      message: 'Pago con tarjeta procesado y saldo de cuenta asociado debitado correctamente.',
      pago: pagoGuardado,
      nuevoSaldo: cuentaAsociada.saldo,
    };
  }
}
