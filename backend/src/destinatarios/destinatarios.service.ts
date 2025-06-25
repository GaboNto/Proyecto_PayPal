import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destinatario } from './entities/destinatario.entity';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { User } from 'src/users/user.entity';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';

@Injectable()
export class DestinatariosService {
  constructor(
    @InjectRepository(Destinatario)
    private destinatariosRepository: Repository<Destinatario>,
  ) {}

  async create(createDestinatarioDto: CreateDestinatarioDto, propietario: User): Promise<Destinatario> {
    const nuevoDestinatario = this.destinatariosRepository.create({
      ...createDestinatarioDto,
      propietario,
    });
    return this.destinatariosRepository.save(nuevoDestinatario);
  }

  findByPropietarioId(propietarioId: number): Promise<Destinatario[]> {
    return this.destinatariosRepository.find({
      where: { propietario: { id_usuario: propietarioId } },
      order: {
        es_favorito: 'DESC',
        nombre: 'ASC',
      },
    });
  }

  async update(id: number, propietarioId: number, updateDestinatarioDto: UpdateDestinatarioDto): Promise<Destinatario> {
    const destinatario = await this.destinatariosRepository.findOne({ where: { id, propietario: { id_usuario: propietarioId } } });
    if (!destinatario) {
      throw new NotFoundException('Destinatario no encontrado.');
    }
    
    this.destinatariosRepository.merge(destinatario, updateDestinatarioDto);
    return this.destinatariosRepository.save(destinatario);
  }

  async delete(id: number, propietarioId: number): Promise<void> {
    const result = await this.destinatariosRepository.delete({ id, propietario: { id_usuario: propietarioId } });
    if (result.affected === 0) {
      throw new NotFoundException('Destinatario no encontrado o no tienes permiso para eliminarlo.');
    }
  }

  async toggleFavorito(destinatarioId: number, propietarioId: number): Promise<Destinatario> {
    const destinatario = await this.destinatariosRepository.findOne({ where: { id: destinatarioId, propietario: { id_usuario: propietarioId } } });

    if (!destinatario) {
      throw new NotFoundException('Destinatario no encontrado.');
    }

    destinatario.es_favorito = !destinatario.es_favorito;
    return this.destinatariosRepository.save(destinatario);
  }
} 