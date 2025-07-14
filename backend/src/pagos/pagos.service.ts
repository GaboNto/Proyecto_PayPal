/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagosRepository: Repository<Pago>,
  ) {}

  async create(createPagoDto: CreatePagoDto) {
    try {
      // Llamada POST a la API FastAPI para obtener la categoría
      const response = await axios.post('http://127.0.0.1:8000/predecir', {
        texto: createPagoDto.descripcion,
      });

      const categoria = response.data.categoria;

      // Crear la entidad Pago para guardar
      const nuevoPago = this.pagosRepository.create({
        idusuario: createPagoDto.idusuario,
        monto: createPagoDto.monto,
        descripcion: createPagoDto.descripcion,
        categoria, // Campo extra que guardas con la categoría predicha
      });

      // Guardar en base de datos
      const pagoGuardado = await this.pagosRepository.save(nuevoPago);

      return {
        message: 'Pago creado y categorizado',
        pago: pagoGuardado,
      };
    } catch (error) {
      console.error('Error al conectar con FastAPI:', error.message);
      throw new InternalServerErrorException('Error al conectar con el servicio de predicción');
    }
  }

  findAll() {
    return this.pagosRepository.find();
  }

  findOne(id: number) {
    return this.pagosRepository.findOneBy({ id });
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    await this.pagosRepository.update(id, updatePagoDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.pagosRepository.delete(id);
    return { message: `Pago #${id} eliminado` };
  }
}
