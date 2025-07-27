import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Data Transfer Object (DTO) que representa un movimiento del historial bancario.
 */

export interface MovimientoHistorialDto {
    fecha: string;
    descripcion: string;
    categoria: string;
    abono: number;
}
/**
 * Servicio encargado de obtener el historial de movimientos del usuario autenticado.
 */
@Injectable({
    providedIn: 'root'
})
export class MovimientosService {
    private baseUrl = 'http://localhost:3000/api/movimientos/historial';
  /**
   * Constructor del servicio.
   * 
   * @param http Cliente HTTP utilizado para realizar solicitudes al backend.
   */
    constructor(private http: HttpClient) { }
  /**
   * Obtiene el historial de movimientos del usuario autenticado desde el backend.
   * Agrega el token JWT almacenado localmente en los encabezados de la solicitud.
   *
   * @returns Observable que emite un arreglo de objetos `MovimientoHistorialDto`.
   */
    obtenerMovimientosPorUsuario(): Observable<MovimientoHistorialDto[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        let historial = this.http.get<MovimientoHistorialDto[]>(this.baseUrl, { headers })
        return historial;
    }
}
