import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/**
 * Servicio que permite obtener el saldo actual del usuario autenticado.
 */
@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private apiUrl = 'http://localhost:3000/saldos';
  /**
   * Constructor del servicio.
   * 
   * @param http Cliente HTTP utilizado para realizar las solicitudes al backend.
   */
  constructor(private http: HttpClient) { }
  /**
   * Obtiene el saldo actual disponible del usuario.
   * 
   * @returns Observable con el resultado del backend (normalmente un número o un objeto con propiedad `saldo`).
   */
  getCurrentSaldo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current`);
  }
} 