import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/**
 * Servicio encargado de manejar las transferencias bancarias,
 * tanto internas como externas, además de la consulta de historial y saldos.
 */
@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private apiUrl = 'http://localhost:3000/api/transfers';
  /**
   * Constructor del servicio.
   * 
   * @param http Cliente HTTP utilizado para interactuar con la API.
   */
  constructor(private http: HttpClient) { }
  /**
   * Realiza una transferencia entre cuentas propias del mismo usuario.
   * 
   * @param data Objeto con los datos de la transferencia (origen, destino, monto, etc.).
   * @returns Observable con la respuesta del backend.
   */
  transferBetweenOwnAccounts(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/between-accounts`, data);
  }
  /**
   * Realiza una transferencia a un destinatario externo registrado.
   * 
   * @param transferData Objeto con los datos de la transferencia (cuenta origen, destinatario, monto, etc.).
   * @returns Observable con la respuesta del backend.
   */
  createTransfer(transferData: any): Observable<any> {
    return this.http.post(this.apiUrl, transferData);
  }
  /**
   * Obtiene el historial de transferencias, opcionalmente filtrado por rango de fechas.
   * 
   * @param from Fecha de inicio (opcional).
   * @param to Fecha de término (opcional).
   * @returns Observable con el historial de transferencias.
   */
  getHistory(from?: string, to?: string): Observable<any> {
    let params = '';
    if (from) params += `from=${from}`;
    if (to) params += (params ? '&' : '') + `to=${to}`;
    const url = params ? `${this.apiUrl}/history?${params}` : `${this.apiUrl}/history`;
    return this.http.get(url);
  }

  /**
   * Obtiene el historial completo de transferencias del usuario autenticado.
   * 
   * @returns Observable con los movimientos del historial.
   */
  obtenerHistorialUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial`);
  }

  
  /**
   * Obtiene el tipo de cuenta y el saldo actual de una cuenta específica.
   * 
   * @param numeroCuenta Número de cuenta del cual se quiere obtener la información.
   * @returns Observable con el tipo de cuenta y su saldo.
   */
  obtenerTipoYSaldoPorCuenta(numeroCuenta: string) {
    return this.http.get<{ tipoCuenta: string, saldo: number }>(`${this.apiUrl}/cuenta-info/${numeroCuenta}`);
  }




}
