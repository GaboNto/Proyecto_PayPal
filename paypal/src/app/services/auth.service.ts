import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Un observable para que los componentes sepan si el estado de login cambió.
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router, private http: HttpClient) { }

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

  forgotPassword(email: string): Observable<any> {
    return this.http.post('/api/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post('/api/auth/reset-password', { token, newPassword });
  }

  setup2FA(): Observable<{ secret: string, qr: string }> {
    return this.http.get<{ secret: string, qr: string }>('/api/users/2fa/setup');
  }

  verify2FA(code: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/api/users/2fa/verify', { code });
  }

  sendEmailVerification(email: string): Observable<any> {
    return this.http.post('/api/auth/send-verification-email', { email });
  }
} 