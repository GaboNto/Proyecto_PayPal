/* eslint-disable prettier/prettier */
// src/users/users.service.ts
import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { SetBepassDto } from './dto/set-bepass.dto';
import * as bcrypt from 'bcrypt';
import { VerifyBepassDto } from './dto/verify-bepass.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

   /**
    * Se busca un unico usuario asociado a su ID, registrado en la base de datos
    * y su cuenta relaciona.
    * @param userId 
    * @returns el user identificado 
    * @throws NotFoundException si no se encuentra el usuari
    */
  async findUserProfile(userId: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id_usuario: userId },
      relations: ['cuentas'], // aqui buscamo la cuenta relacionada  con el usuario 
    });
    if (!user) {
      throw new NotFoundException(`User profile with ID ${userId} not found`);
    }
    return user;
  }

 
  /**
   * Buscamos un usuario por su email asociado
   * @param email - Emeail asociado al usuario
   * @returns Devuelve al usuairo o o un null en caso de no ser encontrado
   */
  findUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email }, relations: ['cuentas'] });
  }

  /**
   * creamos un usuario nuevo con las propiedades del DTO
   * @param createUserDto - objeto con los datos para crear el usuario
   * @returns retorna al usuario encontrado 
   */
  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

   /**
    * Busca un usuario por su ID, incluyendo sus cuentas asociadas.
    * @param id - ID del usuario a buscar.
    * @returns retorna al usuario encontrado
    * @throws NotFoundException si no se encuentra el usuario.
    */
  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id_usuario: id },
      relations: ['cuentas'], // Esto asegura que las cuentas del usuario se carguen
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  
  /**
   * Verifica si la clave Be Pass proporcionada coincide con la almacenada en el usuario.
   *
   * @param userId - ID del usuario a validar.
   * @param verifyBepassDto - Objeto con la clave Be Pass a verificar.
   * @returns retorna si fue exitosa la verificación.
   * @throws NotFoundException si el usuario no existe.
   * @throws BadRequestException si el usuario no tiene una Be Pass configurada.
   * @throws UnauthorizedException si la Be Pass es incorrecta.
   */
  async verifyBepass(userId: number, verifyBepassDto: VerifyBepassDto): Promise<{ success: boolean }> {
    const { bepass } = verifyBepassDto;
    const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    if (!user.bepass) {
      throw new BadRequestException('El usuario no ha configurado una clave Be Pass.');
    }

    const isBepassValid = await bcrypt.compare(bepass, user.bepass);
    if (!isBepassValid) {
      throw new UnauthorizedException('La clave Be Pass es incorrecta.');
    }

    return { success: true };
  }

    /**
   * Configura o actualiza la clave Be Pass del usuario 
   *
   * @param userId - ID del usuario que quiere configurar su Be Pass.
   * @param setBepassDto - contiene las nuevas claves Be Pass
   * @returns retorna con un mensaje de éxito.
   * @throws BadRequestException si las claves nuevas no coinciden o si el modo es inválido.
   * @throws NotFoundException si el usuario no existe.
   * @throws UnauthorizedException si la contraseña actual es incorrecta.
   */
  async setBepass(userId: number, setBepassDto: SetBepassDto): Promise<{ message: string }> {
    const { newBepass, confirmBepass, currentPassword } = setBepassDto;

    if (newBepass !== confirmBepass) {
      throw new BadRequestException('Las claves Be Pass no coinciden.');
    }

    const user = await this.usersRepository.findOne({ where: { id_usuario: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    // Validación: si el usuario ya tiene Be Pass, solo puede cambiarla, no crearla de nuevo
    if (user.bepass) {
      // Si el frontend está en modo creación, lanzar error
      if (!setBepassDto.isChange) {
        throw new BadRequestException('Ya tienes una clave Be Pass. Solo puedes cambiarla.');
      }
    } else {
      // Si el frontend está en modo cambio, lanzar error
      if (setBepassDto.isChange) {
        throw new BadRequestException('No tienes una clave Be Pass configurada. Debes crearla primero.');
      }
    }

    const hashedBepass = await bcrypt.hash(newBepass, 10);
    user.bepass = hashedBepass;

    await this.usersRepository.save(user);

    return { message: user.bepass ? 'Clave Be Pass actualizada con éxito.' : 'Clave Be Pass creada con éxito.' };
  }

  /**
   * Guarda un usuario directamente en la base de datos.
   * Usado generalmente para persistir cambios en la entidad User.
   *
   * @param user - Objeto usuario con cambios a guardar.
   * @returns retorna al usuario actualizado.
   */
  async save(user: User) {
    return this.usersRepository.save(user);
  }
}
