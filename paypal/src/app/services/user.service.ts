import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  setBepass(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/set-bepass`, data);
  }

  verifyBepass(bepass: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/verify-bepass`, { bepass });
  }

  hasBepass(): Observable<{ hasBepass: boolean }> {
    return this.http.get<{ hasBepass: boolean }>(`${this.apiUrl}/has-bepass`);
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }
} 