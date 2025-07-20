import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    private baseUrl = 'http://localhost:3000/api/movimientos/historial';

    constructor(private http: HttpClient) { }

    obtenerMovimientosPorUsuario(): Observable<MovimientoHistorialDto[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        let historial = this.http.get<MovimientoHistorialDto[]>(this.baseUrl, { headers })
        return historial;
    }
}
