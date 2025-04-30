/* eslint-disable prettier/prettier */
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // Crear un nuevo usuario
  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hashedPassword });
    return this.repo.save(user);
  }

  // Buscar un usuario por email
  async findUserByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }
}
