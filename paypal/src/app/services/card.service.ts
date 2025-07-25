import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = 'http://190.45.118.42:3000/api/cards';

  constructor(private http: HttpClient) { }

  toggleBlock(cardId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${cardId}/toggle-block`, {});
  }
} 