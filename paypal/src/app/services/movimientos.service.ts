import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../config/api-config'; // Ajusta ruta según estructura

export interface MovimientoHistorialDto {
    fecha: string;
    descripcion: string;
    categoria: string;
    abono: number;
}

@Injectable({
    providedIn: 'root'
})
export class MovimientosService {

    constructor(private http: HttpClient, private baseUrl = ENDPOINTS.base) { }

    obtenerMovimientosPorUsuario(): Observable<MovimientoHistorialDto[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        let historial = this.http.get<MovimientoHistorialDto[]>(`${this.baseUrl}/movimientos/historial`, { headers })
        return historial;
    }
}
