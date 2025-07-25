import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient, @Inject(BASE_URL) private baseUrl: string) { }

  private apiUrl = `${this.baseUrl}/cards`;

  toggleBlock(cardId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${cardId}/toggle-block`, {});
  }
} 