import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../config/api-config';

export interface Destinatario {
  id: number;
  nombre: string;
  rut: string;
  alias?: string;
  correo_electronico?: string;
  banco: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  es_favorito: boolean;
}

export type CreateDestinatario = Omit<Destinatario, 'id' | 'es_favorito'>;
export type UpdateDestinatario = Partial<CreateDestinatario>;

@Injectable({
  providedIn: 'root'
})
export class DestinatariosService {

  constructor(private http: HttpClient) { }
  private baseUrl = ENDPOINTS.base;
  private apiUrl = `${this.baseUrl}/destinatarios`

  getDestinatarios(): Observable<Destinatario[]> {
    return this.http.get<Destinatario[]>(this.apiUrl);
  }

  createDestinatario(destinatario: CreateDestinatario): Observable<Destinatario> {
    return this.http.post<Destinatario>(this.apiUrl, destinatario);
  }

  updateDestinatario(id: number, destinatario: UpdateDestinatario): Observable<Destinatario> {
    return this.http.patch<Destinatario>(`${this.apiUrl}/${id}`, destinatario);
  }

  deleteDestinatario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleFavorito(id: number): Observable<Destinatario> {
    return this.http.patch<Destinatario>(`${this.apiUrl}/${id}/favorito`, {});
  }
} 