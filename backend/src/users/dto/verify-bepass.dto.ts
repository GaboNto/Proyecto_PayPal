import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyBepassDto {
  @IsString({ message: 'La clave Be Pass debe ser un texto.' })
  @IsNotEmpty({ message: 'La clave Be Pass no puede estar vacía.' })
  @Length(6, 6, { message: 'La clave Be Pass debe tener exactamente 6 dígitos.' })
  bepass: string;
} 