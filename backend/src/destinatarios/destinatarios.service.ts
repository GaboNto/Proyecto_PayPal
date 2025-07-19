import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destinatario } from './entities/destinatario.entity';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { User } from 'src/users/user.entity';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';

/**
 * @class DestinatariosService
 * @description lógica para la gestión de destinatarios.
 * crear, buscar, actualizar y eliminar destinatarios,
 * asegurando que cada destinatario esté asociado a un usuario propietario.
 * También permite marcar destinatarios como favoritos.
 */
@Injectable()
export class DestinatariosService {
  constructor(
    @InjectRepository(Destinatario)
    private destinatariosRepository: Repository<Destinatario>,
  ) {}
    /**
   * @method create
   * @description Crea y registra un nuevo destinatario en la base de datos.
   * Asocia el destinatario recién creado con un usuario propietario.
   * @param createDestinatarioDto DTO que contiene los datos del nuevo destinatario.
   * @param propietario La entidad User que representa al usuario que está creando este destinatario.
   * @returns retorna la entidad Destinatario creada.
   */
  async create(createDestinatarioDto: CreateDestinatarioDto, propietario: User): Promise<Destinatario> {
    const nuevoDestinatario = this.destinatariosRepository.create({
      ...createDestinatarioDto,
      propietario,
    });
    return this.destinatariosRepository.save(nuevoDestinatario);
  }

    /**
   * @method findByPropietarioId
   * @description Busca y devuelve todos los destinatarios asociados a un ID de usuario específico.
   * Los resultados se ordenan para mostrar primero los favoritos y luego alfabéticamente por nombre.
   * @param propietarioId El ID del usuario de los destinatarios.
   * @returns retorna la entidades Destinatario.
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
   * @method update
   * @description Actualiza los datos de un destinatario existente.
   * Se asegura de que el destinatario pertenezca al usuario que intenta actualizarlo.
   * @param id El ID numérico del destinatario a actualizar.
   * @param propietarioId El ID del usuario 
   * @param updateDestinatarioDto DTO con los campos a actualizar del destinatario.
   * @returns entidad Destinatario actualizada.
   * @throws NotFoundException Si el destinatario no se encuentra o no pertenece al propietario especificado.
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
   * @method delete
   * @description Elimina un destinatario de la base de datos.
   * Se asegura de que el destinatario pertenezca al usuario que intenta eliminarlo.
   * @param id El ID del destinatario a eliminar.
   * @param propietarioId El ID del usuario propietario del destinatario.
   * @returns Una Promesa vacía (`void`) si la eliminación fue exitosa.
   * @throws NotFoundException Si el destinatario no se encuentra o no pertenece al propietario especificado.
   */
  async delete(id: number, propietarioId: number): Promise<void> {
    const result = await this.destinatariosRepository.delete({ id, propietario: { id_usuario: propietarioId } });
    if (result.affected === 0) {
      throw new NotFoundException('Destinatario no encontrado o no tienes permiso para eliminarlo.');
    }
  }

    /**
   * @method toggleFavorito
   * @description Cambia el estado `es_favorito` (marcar/desmarcar como favorito) de un destinatario.
   * Se asegura de que el destinatario pertenezca al usuario que realiza la acción.
   * @param destinatarioId El ID del destinatario cuyo estado favorito se va a cambiar.
   * @param propietarioId El ID del usuario propietario del destinatario (para validación de permisos).
   * @returns entidad Destinatario con el estado `es_favorito` actualizado.
   * @throws NotFoundException Si el destinatario no se encuentra o no pertenece al propietario especificado.
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