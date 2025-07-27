import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/**
 * Servicio que gestiona las operaciones del usuario autenticado,
 * incluyendo la configuración y verificación de la clave Be Pass,
 * y la obtención del perfil.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
 /**
   * Constructor del servicio.
   *
   * @param http Cliente HTTP utilizado para interactuar con la API.
   */
  constructor(private http: HttpClient) { }
  /**
   * Establece o actualiza la clave secundaria Be Pass para el usuario autenticado.
   *
   * @param data Objeto con los datos necesarios (ej. clave nueva y confirmación).
   * @returns Observable con la respuesta del backend.
   */
  setBepass(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/set-bepass`, data);
  }
  /**
   * Verifica si la clave secundaria Be Pass ingresada es válida.
   *
   * @param bepass Clave Be Pass ingresada por el usuario.
   * @returns Observable que indica si la verificación fue exitosa.
   */
  verifyBepass(bepass: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/verify-bepass`, { bepass });
  }
  /**
   * Verifica si el usuario ya tiene configurada una clave Be Pass.
   *
   * @returns Observable que indica si existe una clave registrada.
   */
  hasBepass(): Observable<{ hasBepass: boolean }> {
    return this.http.get<{ hasBepass: boolean }>(`${this.apiUrl}/has-bepass`);
  }

  /**
   * Obtiene los datos del perfil del usuario autenticado.
   *
   * @returns Observable con la información del perfil del usuario.
   */
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }
} 