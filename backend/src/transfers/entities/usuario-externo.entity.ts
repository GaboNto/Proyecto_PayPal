/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios_externos')
export class UsuarioExterno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 12, unique: true })
  rut: string;

  @Column({ length: 50 })
  banco: string;

  @Column({ name: 'tipo_cuenta', length: 50 })
  tipo_cuenta: string;

  @Column({ name: 'numero_cuenta', length: 30 })
  numero_cuenta: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  // eslint-disable-next-line prettier/prettier
  saldo: number;
} 