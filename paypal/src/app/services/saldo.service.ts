import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {

  constructor(private http: HttpClient, private baseUrl = ENDPOINTS.base) { }

  getCurrentSaldo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/saldos/current`);
  }
} 