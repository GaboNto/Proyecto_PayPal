import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }
  private baseUrl = ENDPOINTS.base;

  private apiUrl = `${this.baseUrl}/cards`

  toggleBlock(cardId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${cardId}/toggle-block`, {});
  }
} 