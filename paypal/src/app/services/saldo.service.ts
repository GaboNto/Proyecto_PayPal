import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private apiUrl = 'http://localhost:3000/saldos';

  constructor(private http: HttpClient) { }

  getCurrentSaldo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current`);
  }
} 