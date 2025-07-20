// src/app/components/movimientos/movimientos.component.ts
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

  movimientos: MovimientoHistorialDto[] = [];
  loading = false;
  error: string | null = null;

  constructor(private movimientosService: MovimientosService) { }

  ngOnInit(): void {
    this.cargarMovimientos();
  }

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
