/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { Destinatario } from '../destinatarios/entities/destinatario.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ name: 'correo_electronico', unique: true })
  email: string;

  @Column({ name: 'contrasena' })
  password: string;

  @Column({ type: 'date', name: 'fecha_nacimiento' })
  fecha_nacimiento: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @Column({ nullable: true })
  rut: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  facturacion: string;

  @Column({ length: 50, default: 'Paypal' })
  banco: string;

  @OneToMany(() => Cuenta, (cuenta: Cuenta) => cuenta.usuario)
  cuentas: Cuenta[];

  @OneToMany('Destinatario', (destinatario: Destinatario) => destinatario.propietario)
  destinatarios: Destinatario[];

  @Column({ name: 'bepass', nullable: true })
  bepass: string;

  @Column({ name: 'totp_secret', nullable: true })
  totpSecret?: string;

  @Column({ name: 'email_verificado', type: 'boolean', default: false })
  emailVerificado: boolean;

  @Column({ name: '2fa_enabled', type: 'boolean', default: false })
  twoFAEnabled: boolean;
}
