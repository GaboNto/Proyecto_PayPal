// src/app/components/movimientos/movimientos.component.ts
/**
 * Componente que muestra el historial de movimientos financieros del usuario.
 * Se comunica con el servicio `MovimientosService` para obtener los datos.
 */
import { Component, OnInit } from '@angular/core';
import { MovimientosService, MovimientoHistorialDto } from '../../services/movimientos.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  imports: [
    CommonModule,
  ], standalone: true
})
export class MovimientosComponent implements OnInit {
 /**
   * Lista de movimientos financieros obtenidos desde el backend.
   */
  movimientos: MovimientoHistorialDto[] = [];
  
  /**
   * Indica si la información se está cargando actualmente.
   */
  loading = false;
  
  /**
   * Mensaje de error en caso de que la carga falle.
   */
  error: string | null = null;

    /**
   * Inyecta el servicio de movimientos para obtener el historial.
   * @param movimientosService Servicio que gestiona la obtención de movimientos.
   */
  constructor(private movimientosService: MovimientosService) { }

    /**
   * Al inicializar el componente, se cargan los movimientos del usuario.
   */
  ngOnInit(): void {
    this.cargarMovimientos();
  }
  /**
   * Solicita al servicio los movimientos financieros del usuario.
   * Maneja estados de carga y errores.
   */
  cargarMovimientos(): void {
    this.loading = true;
    this.movimientosService.obtenerMovimientosPorUsuario().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar movimientos';
        this.loading = false;
      }
    });
  }

}
