import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../config/api-config'; // Ajusta ruta según estructura

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

    constructor(private http: HttpClient, @Inject(BASE_URL) private baseUrl: string) { }

    obtenerMovimientosPorUsuario(): Observable<MovimientoHistorialDto[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        let historial = this.http.get<MovimientoHistorialDto[]>(`${this.baseUrl}/movimientos/historial`, { headers })
        return historial;
    }
}
