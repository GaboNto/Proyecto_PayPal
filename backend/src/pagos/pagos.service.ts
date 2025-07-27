/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';
import axios from 'axios';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagosRepository: Repository<Pago>,
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
  ) { }
  /**
   * Crea un nuevo pago, asigna una categoría usando FastAPI
   * y descuenta el monto del saldo de la cuenta correspondiente.
   * 
   * @param createPagoDto Datos del pago (monto, descripción, cuenta)
   * @returns Detalles del pago creado y saldo actualizado
   */
  async create(createPagoDto: CreatePagoDto) {
    const { monto, descripcion, numeroCuenta } = createPagoDto;
    // Buscar cuenta con usuario relacionado
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
    // Llamada al microservicio en FastAPI para clasificar categoría
    try {
      const response = await axios.post('http://127.0.0.1:8000/predecir', {
        texto: descripcion,
      });
      // Se asume la estructura esperada de response.data
      const data = response.data as { categoria: string };
      categoria = data.categoria;
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
    // Respuesta para frontend o cliente
    return {
      message: 'Pago creado correctamente',
      pago: pagoGuardado,
      nuevoSaldo: cuenta.saldo,
    };
  }
}
