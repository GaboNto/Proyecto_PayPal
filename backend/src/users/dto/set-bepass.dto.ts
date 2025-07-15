import { IsString, Length, Matches, IsOptional, IsBoolean } from 'class-validator';

export class SetBepassDto {
  @IsString()
  @Length(6, 6, { message: 'La clave Be Pass debe tener exactamente 6 dígitos.' })
  @Matches(/^[0-9]+$/, { message: 'La clave Be Pass solo debe contener números.' })
  newBepass: string;

  @IsString()
  confirmBepass: string;

  @IsString()
  currentPassword: string;

  @IsOptional()
  @IsBoolean()
  isChange?: boolean;
}
