import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ 
    description: 'Token de restablecimiento de contraseña', 
    example: 'abc123def456...' 
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ 
    description: 'Nueva contraseña', 
    example: 'nuevaContraseña123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
} 