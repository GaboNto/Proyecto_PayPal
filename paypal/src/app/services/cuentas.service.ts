import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Card {
  id: string;
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  is_blocked: boolean;
}

/**
 * Representa una tarjeta bancaria asociada a una cuenta.
 */
export interface Cuenta {
  id: number;
  numero_cuenta: string;
  tipo_cuenta: string;
  saldo: number;
  cards?: Card[];
}

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private apiUrl = 'http://localhost:3000/api/cuentas';
  /**
   * Constructor del servicio.
   * 
   * @param http Cliente HTTP para realizar solicitudes al backend.
   */
  constructor(private http: HttpClient) { }

    /**
   * Obtiene todas las cuentas asociadas al usuario autenticado.
   * 
   * @returns Observable que emite un arreglo de cuentas.
   */
  getCuentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  /**
   * Crea una nueva cuenta bancaria para el usuario.
   * 
   * @param tipo_cuenta Tipo de cuenta a crear (por ejemplo, "corriente").
   * @returns Observable con la respuesta del backend.
   */
  createCuenta(tipo_cuenta: string): Observable<any> {
    return this.http.post(this.apiUrl, { tipo_cuenta });
  }
} 