import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private http: HttpClient, private baseUrl = ENDPOINTS.base) { }

  private apiUrl = `${this.baseUrl}/transfers`

  transferBetweenOwnAccounts(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/between-accounts`, data);
  }

  createTransfer(transferData: any): Observable<any> {
    return this.http.post(this.apiUrl, transferData);
  }

  getHistory(from?: string, to?: string): Observable<any> {
    let params = '';
    if (from) params += `from=${from}`;
    if (to) params += (params ? '&' : '') + `to=${to}`;
    const url = params ? `${this.apiUrl}/history?${params}` : `${this.apiUrl}/history`;
    return this.http.get(url);
  }


  obtenerHistorialUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial`);
  }

  // Ejemplo en el service:
  obtenerTipoYSaldoPorCuenta(numeroCuenta: string) {
    return this.http.get<{ tipoCuenta: string, saldo: number }>(`${this.apiUrl}/cuenta-info/${numeroCuenta}`);
  }




}
