import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Le decimos a Passport que use 'email' como el "nombre de usuario"
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('LocalStrategy - Email recibido:', email);
    console.log('LocalStrategy - Password recibido:', password ? '***' : 'undefined');
    
    const user = await this.authService.validateUser(email, password);
    console.log('LocalStrategy - Usuario validado:', user ? 'Sí' : 'No');
    
    if (!user) {
      console.log('LocalStrategy - Lanzando UnauthorizedException');
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    
    console.log('LocalStrategy - Usuario retornado exitosamente');
    return user;
  }
} 