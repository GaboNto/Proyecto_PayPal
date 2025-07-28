import { Component, OnInit } from '@angular/core';
import { MovimientosService, MovimientoHistorialDto } from '../../services/movimientos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  imports: [
    CommonModule,
    FormsModule,
  ],
  standalone: true
})
export class MovimientosComponent implements OnInit {
  movimientos: MovimientoHistorialDto[] = [];
  loading = false;
  error: string | null = null;

  filtroCategoria: string = '';
  filtroFechaInicio?: Date;
  filtroFechaFin?: Date;

  categorias: string[] = [
    'Viajes',
    'Comida',
    'Transporte',
    'Servicios',
    'Entretenimiento',
    'Finanzas',
    'Supermercado',
    'Transferencia',
  ];



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



  get movimientosFiltrados(): MovimientoHistorialDto[] {
    // Convertir strings a fechas solo una vez para evitar crear nuevas fechas cada vez que se accede
    const fechaInicio = this.filtroFechaInicio ? new Date(this.filtroFechaInicio) : null;
    const fechaFin = this.filtroFechaFin ? new Date(this.filtroFechaFin) : null;

    // Ajustar la fecha fin para incluir todo el día (hasta 23:59:59)
    if (fechaFin) {
      fechaFin.setHours(23, 59, 59, 999);
    }

    return this.movimientos.filter(m => {
      const matchCategoria = this.filtroCategoria ? m.categoria === this.filtroCategoria : true;

      const fechaMovimiento = new Date(m.fecha);

      const matchFechaInicio = fechaInicio ? fechaMovimiento >= fechaInicio : true;
      const matchFechaFin = fechaFin ? fechaMovimiento <= fechaFin : true;

      return matchCategoria && matchFechaInicio && matchFechaFin;
    });
  }

}
