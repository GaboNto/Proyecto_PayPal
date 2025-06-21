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
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  // Se llama al iniciar sesión. Guarda el token y notifica a los suscriptores.
  login(token: string): void {
    localStorage.setItem('access_token', token);
    this.loggedIn.next(true);
  }

  // Cierra la sesión. Elimina el token y notifica a los suscriptores.
  logout(): void {
    localStorage.removeItem('access_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']); // Redirige al login.
  }
} 