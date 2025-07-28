/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { Destinatario } from '../destinatarios/entities/destinatario.entity';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Entity('usuarios')
export class User {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
    type: 'integer',
  })
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @Column()
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @Column()
  apellido: string;

  @ApiProperty({
    description: 'Dirección de correo electrónico del usuario (única)',
    example: 'juan.perez@example.com',
    format: 'email',
    uniqueItems: true,
  })
  @Column({ name: 'correo_electronico', unique: true })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (hash)',
    example: 'hashedpassword123',
    writeOnly: true, // No se muestra en las respuestas de la API
  })
  @Column({ name: 'contrasena' })
  password: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario en formato YYYY-MM-DD',
    example: '1990-01-15',
    type: 'string',
    format: 'date',
  })
  @Column({ type: 'date', name: 'fecha_nacimiento' })
  fecha_nacimiento: string;

  @ApiProperty({
    description: 'País de residencia del usuario',
    example: 'Chile',
  })
  @Column()
  pais: string;

  @ApiProperty({
    description: 'Ciudad de residencia del usuario',
    example: 'Santiago',
  })
  @Column()
  ciudad: string;

  @ApiProperty({
    description: 'RUT (Rol Único Tributario) del usuario (opcional)',
    example: '12345678-9',
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  rut: string;

  @ApiProperty({
    description: 'Dirección del usuario (opcional)',
    example: 'Calle Falsa 123',
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  direccion: string;

  @ApiProperty({
    description: 'Información de facturación del usuario (opcional)',
    example: 'Boleta Electrónica',
    nullable: true,
    required: false,
  })
  @Column({ nullable: true })
  facturacion: string;

  @ApiProperty({
    description: 'Banco principal del usuario (por defecto "Paypal")',
    example: 'Paypal',
    maxLength: 50,
  })
  @Column({ length: 50, default: 'Paypal' })
  banco: string;

  @ApiProperty({
    description: 'Lista de cuentas bancarias asociadas al usuario',
    type: () => [Cuenta], // Indica que es un array de Cuenta
  })
  @OneToMany(() => Cuenta, (cuenta: Cuenta) => cuenta.usuario)
  cuentas: Cuenta[];

  @ApiProperty({
    description: 'Lista de destinatarios guardados por el usuario',
    type: () => [Destinatario], // Indica que es un array de Destinatario
  })
  @OneToMany('Destinatario', (destinatario: Destinatario) => destinatario.propietario)
  destinatarios: Destinatario[];

  @ApiProperty({
    description: 'Clave BePass del usuario (hash, si está configurada)',
    example: 'hashedbepass',
    nullable: true,
    required: false,
    writeOnly: true, // No se muestra en las respuestas de la API
  })
  @Column({ name: 'bepass', nullable: true })
  bepass: string;

  @ApiProperty({
    description: 'Secreto TOTP para la autenticación de dos factores (si está configurado)',
    example: 'JBSWY3DPEHPK3PXP',
    nullable: true,
    required: false,
    writeOnly: true, // No se muestra en las respuestas de la API
  })
  @Column({ name: 'totp_secret', nullable: true })
  totpSecret?: string;

  @ApiProperty({
    description: 'Indica si el correo electrónico del usuario ha sido verificado',
    example: false,
    default: false,
  })
  @Column({ name: 'email_verificado', type: 'boolean', default: false })
  emailVerificado: boolean;

  @ApiProperty({
    description: 'Indica si la autenticación de dos factores (2FA) está habilitada para el usuario',
    example: false,
    default: false,
  })
  @Column({ name: '2fa_enabled', type: 'boolean', default: false })
  twoFAEnabled: boolean;
}
