import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Un observable para que los componentes sepan si el estado de login cambió.
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router) { }

  // Revisa si ya existe un token en el almacenamiento local.
  private hasToken(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }

  // Se llama al iniciar sesión. Guarda el token y notifica a los suscriptores.
  login(token: string): void {
    localStorage.setItem('accessToken', token);
    this.loggedIn.next(true);
  }

  // Cierra la sesión. Elimina el token y notifica a los suscriptores.
  logout(): void {
    localStorage.removeItem('accessToken');
    this.loggedIn.next(false);
    this.router.navigate(['/login']); // Redirige al login.
  }
} 