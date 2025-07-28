import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {

  constructor() { }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Verificar longitud mínima
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    // Verificar mayúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una mayúscula');
    }

    // Verificar números
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    // Verificar números consecutivos
    if (this.hasConsecutiveNumbers(password)) {
      errors.push('La contraseña no debe contener números consecutivos (123, 456, etc.)');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  private hasConsecutiveNumbers(password: string): boolean {
    for (let i = 0; i < password.length - 2; i++) {
      const char1 = password[i];
      const char2 = password[i + 1];
      const char3 = password[i + 2];
      
      if (/\d/.test(char1) && /\d/.test(char2) && /\d/.test(char3)) {
        const num1 = parseInt(char1);
        const num2 = parseInt(char2);
        const num3 = parseInt(char3);
        
        if (num2 === num1 + 1 && num3 === num2 + 1) {
          return true;
        }
      }
    }
    return false;
  }

  getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  }
} 