import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio de autenticación que gestiona el estado de login,
 * recuperación de cuenta, verificación de 2FA y envío de correos.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Observable que representa si el usuario está autenticado o no.
   */
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    /**
   * Estado interno del login, basado en si hay token almacenado.
   */
  isLoggedIn$ = this.loggedIn.asObservable();
  /**
   * Constructor del servicio de autenticación.
   * 
   * @param router Servicio de navegación de Angular.
   * @param http Cliente HTTP para interactuar con la API.
   */
  constructor(private router: Router, private http: HttpClient) { }

  /**
   * Verifica si existe un token almacenado en `localStorage`.
   * 
   * @returns `true` si el token existe, `false` en caso contrario.
   */
  private hasToken(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }

  /**
   * Realiza el inicio de sesión, guarda el token y actualiza el estado.
   * 
   * @param token Token JWT recibido tras la autenticación.
   */
  login(token: string): void {
    localStorage.setItem('accessToken', token);
    this.loggedIn.next(true);
  }

  
  /**
   * Cierra la sesión del usuario, elimina el token y redirige al login.
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    this.loggedIn.next(false);
    this.router.navigate(['/login']); // Redirige al login.
  }
  /**
   * Solicita el envío de un correo para recuperación de contraseña.
   * 
   * @param email Correo electrónico del usuario.
   * @returns Observable con la respuesta del backend.
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post('/api/auth/forgot-password', { email });
  }
  /**
   * Envía la nueva contraseña junto al token recibido por correo.
   * 
   * @param token Token de recuperación.
   * @param newPassword Nueva contraseña que desea establecer.
   * @returns Observable con la respuesta del backend.
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post('/api/auth/reset-password', { token, newPassword });
  }

  /**
   * Inicia el proceso de configuración del segundo factor de autenticación (2FA).
   * 
   * @returns Observable con el secreto y el QR para escanear en una app de autenticación.
   */
  setup2FA(): Observable<{ secret: string, qr: string }> {
    return this.http.get<{ secret: string, qr: string }>('/api/users/2fa/setup');
  }
  /**
   * Verifica el código generado por la app de autenticación para completar el 2FA.
   * 
   * @param code Código de 6 dígitos generado por el autenticador.
   * @returns Observable que indica si la verificación fue exitosa.
   */
  verify2FA(code: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/api/users/2fa/verify', { code });
  }
  /**
   * Envía un correo de verificación de cuenta al usuario.
   * 
   * @param email Correo electrónico al cual enviar la verificación.
   * @returns Observable con la respuesta del backend.
   */
  sendEmailVerification(email: string): Observable<any> {
    return this.http.post('/api/auth/send-verification-email', { email });
  }
} 