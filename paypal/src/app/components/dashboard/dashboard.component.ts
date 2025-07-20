import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientosService, MovimientoHistorialDto } from '../../services/movimientos.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  movimientos: MovimientoHistorialDto[] = [];

  filteredMovimientos: MovimientoHistorialDto[] = [];

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  categoriaSeleccionada: string = 'Todas';

  categorias: string[] = ['Todas']; // para cargar categorías únicas de los movimientos

  // Datos para gráficos
  pieChartData: any[] = [];
  lineChartData: any[] = [];

  // Opciones gráficos
  view: [number, number] = [700, 400];
  colorScheme = 'vivid';

  // Line chart options
  lineChartLegend = false;
  lineChartXAxisLabel = 'Fecha';
  lineChartYAxisLabel = 'Monto';

  constructor(private movimientosService: MovimientosService) { }

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    this.movimientosService.obtenerMovimientosPorUsuario().subscribe({
      next: data => {
        this.movimientos = data;
        this.categorias = ['Todas', 'Viajes', 'Supermercado', 'Arroz'].filter(c => c !== 'Transferencia');
        this.aplicarFiltros();
      },
      error: () => {
        this.movimientos = [];
      }
    });
  }

  aplicarFiltros(): void {
    // Filtrar por fecha
    this.filteredMovimientos = this.movimientos.filter(m => {
      const fecha = new Date(m.fecha);
      const desdeOk = this.fechaInicio ? (fecha >= new Date(this.fechaInicio)) : true;
      const hastaOk = this.fechaFin ? (fecha <= new Date(this.fechaFin)) : true;
      const categoriaOk = this.categoriaSeleccionada === 'Todas' || m.categoria === this.categoriaSeleccionada;
      return desdeOk && hastaOk && categoriaOk;
    });

    this.actualizarPieChart();
    this.actualizarLineChart();
  }

  actualizarPieChart(): void {
    const movimientosFiltrados = this.filteredMovimientos.filter(m => m.categoria !== 'Transferencia');

    const agrupado = movimientosFiltrados.reduce((acc, m) => {
      acc[m.categoria] = (acc[m.categoria] || 0) + Math.abs(m.abono);
      return acc;
    }, {} as Record<string, number>);

    this.pieChartData = Object.entries(agrupado).map(([name, value]) => ({ name, value }));
  }



  actualizarLineChart(): void {
    // Agrupar por fecha (por día) y sumar abonos netos
    const agrupado: Record<string, number> = {};

    this.filteredMovimientos.forEach(m => {
      const fechaKey = new Date(m.fecha).toISOString().split('T')[0]; // yyyy-mm-dd
      agrupado[fechaKey] = (agrupado[fechaKey] || 0) + m.abono;
    });

    // Convertir a formato que espera ngx-charts (series con name, value)
    const sortedDates = Object.keys(agrupado).sort();

    this.lineChartData = [{
      name: 'Saldo neto',
      series: sortedDates.map(date => ({
        name: date,
        value: agrupado[date]
      }))
    }];
  }

}
