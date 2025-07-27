import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Representa un destinatario registrado para realizar transferencias bancarias.
 */
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
  private apiUrl = 'http://localhost:3000/api/destinatarios';
  /**
   * Constructor del servicio.
   * 
   * @param http Cliente HTTP para realizar solicitudes al backend.
   */
  constructor(private http: HttpClient) { }
  /**
   * Obtiene todos los destinatarios registrados por el usuario.
   * 
   * @returns Observable con un arreglo de destinatarios.
   */
  getDestinatarios(): Observable<Destinatario[]> {
    return this.http.get<Destinatario[]>(this.apiUrl);
  }
  /**
   * Crea un nuevo destinatario para transferencias.
   * 
   * @param destinatario Datos del destinatario a registrar.
   * @returns Observable con el destinatario creado.
   */
  createDestinatario(destinatario: CreateDestinatario): Observable<Destinatario> {
    return this.http.post<Destinatario>(this.apiUrl, destinatario);
  }
  /**
   * Actualiza la información de un destinatario existente.
   * 
   * @param id ID del destinatario a actualizar.
   * @param destinatario Datos parciales a modificar.
   * @returns Observable con el destinatario actualizado.
   */
  updateDestinatario(id: number, destinatario: UpdateDestinatario): Observable<Destinatario> {
    return this.http.patch<Destinatario>(`${this.apiUrl}/${id}`, destinatario);
  }
  /**
   * Elimina un destinatario del listado del usuario.
   * 
   * @param id ID del destinatario a eliminar.
   * @returns Observable que completa cuando la operación finaliza.
   */
  deleteDestinatario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  /**
   * Cambia el estado de favorito de un destinatario.
   * 
   * @param id ID del destinatario.
   * @returns Observable con el destinatario actualizado.
   */
  toggleFavorito(id: number): Observable<Destinatario> {
    return this.http.patch<Destinatario>(`${this.apiUrl}/${id}/favorito`, {});
  }
} 