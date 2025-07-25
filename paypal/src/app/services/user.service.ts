import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, @Inject(BASE_URL) private baseUrl: string) { }

  private apiUrl = `${this.baseUrl}/users`;

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

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, data);
  }
} 