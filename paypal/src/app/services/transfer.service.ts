import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private apiUrl = 'http://localhost:3000/api/transfers';

  constructor(private http: HttpClient) { }

  transferBetweenOwnAccounts(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/between-accounts`, data);
  }

  createTransfer(transferData: any): Observable<any> {
    return this.http.post(this.apiUrl, transferData);
  }
} 