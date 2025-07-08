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

  constructor(private http: HttpClient) { }

  getCuentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createCuenta(tipo_cuenta: string): Observable<any> {
    return this.http.post(this.apiUrl, { tipo_cuenta });
  }
} 