/* eslint-disable */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destinatario } from './entities/destinatario.entity';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { User } from 'src/users/user.entity';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';

/**
 * Servicio que gestiona las operaciones relacionadas con los destinatarios.
 * Un destinatario representa a un contacto guardado para realizar transferencias.
 */
@Injectable()
export class DestinatariosService {
  constructor(
    @InjectRepository(Destinatario)
    private destinatariosRepository: Repository<Destinatario>,
  ) {}

  /**
   * Crea un nuevo destinatario vinculado a un usuario propietario.
   *
   * @param createDestinatarioDto Datos del destinatario a registrar
   * @param propietario Usuario que crea el destinatario
   * @returns El destinatario creado
   */
  async create(createDestinatarioDto: CreateDestinatarioDto, propietario: User): Promise<Destinatario> {
    const nuevoDestinatario = this.destinatariosRepository.create({
      ...createDestinatarioDto,
      propietario,
    });
    return this.destinatariosRepository.save(nuevoDestinatario);
  }
  /**
   * Obtiene todos los destinatarios asociados a un usuario específico.
   *
   * @param propietarioId ID del usuario propietario
   * @returns Lista de destinatarios ordenados por favorito y nombre
   */
  findByPropietarioId(propietarioId: number): Promise<Destinatario[]> {
    return this.destinatariosRepository.find({
      where: { propietario: { id_usuario: propietarioId } },
      order: {
        es_favorito: 'DESC',
        nombre: 'ASC',
      },
    });
  }
  /**
   * Actualiza los datos de un destinatario específico, validando que pertenezca al usuario.
   *
   * @param id ID del destinatario a modificar
   * @param propietarioId ID del usuario propietario (autenticado)
   * @param updateDestinatarioDto Datos nuevos a aplicar
   * @returns El destinatario actualizado
   * @throws NotFoundException si no se encuentra el destinatario o no pertenece al usuario
   */
  async update(id: number, propietarioId: number, updateDestinatarioDto: UpdateDestinatarioDto): Promise<Destinatario> {
    const destinatario = await this.destinatariosRepository.findOne({ where: { id, propietario: { id_usuario: propietarioId } } });
    if (!destinatario) {
      throw new NotFoundException('Destinatario no encontrado.');
    }
    
    this.destinatariosRepository.merge(destinatario, updateDestinatarioDto);
    return this.destinatariosRepository.save(destinatario);
  }

  /**
   * Elimina un destinatario si pertenece al usuario autenticado.
   *
   * @param id ID del destinatario a eliminar
   * @param propietarioId ID del usuario propietario (autenticado)
   * @throws NotFoundException si no se encuentra o no pertenece al usuario
   */
  async delete(id: number, propietarioId: number): Promise<void> {
    const result = await this.destinatariosRepository.delete({ id, propietario: { id_usuario: propietarioId } });
    if (result.affected === 0) {
      throw new NotFoundException('Destinatario no encontrado o no tienes permiso para eliminarlo.');
    }
  }
  /**
   * Alterna el estado de "favorito" de un destinatario del usuario autenticado.
   *
   * @param destinatarioId ID del destinatario
   * @param propietarioId ID del usuario propietario (autenticado)
   * @returns El destinatario actualizado con el nuevo estado de favorito
   * @throws NotFoundException si el destinatario no existe o no es del usuario
   */
  async toggleFavorito(destinatarioId: number, propietarioId: number): Promise<Destinatario> {
    const destinatario = await this.destinatariosRepository.findOne({ where: { id: destinatarioId, propietario: { id_usuario: propietarioId } } });

    if (!destinatario) {
      throw new NotFoundException('Destinatario no encontrado.');
    }

    destinatario.es_favorito = !destinatario.es_favorito;
    return this.destinatariosRepository.save(destinatario);
  }
} 