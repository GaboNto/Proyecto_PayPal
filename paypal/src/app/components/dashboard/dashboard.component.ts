import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MovimientosService, MovimientoHistorialDto } from '../../services/movimientos.service';
import { TransferService } from '../../services/transfer.service';

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
  historial: any[] = [];

  fechaInicio: string = '';
  fechaFin: string = '';
  categoriaSeleccionada: string = 'Todas';
  categorias: string[] = ['Todas'];

  pieChartData: any[] = [];
  lineChartData: any[] = [];

  view: [number, number] = [700, 400];
  colorScheme = 'vivid';

  lineChartLegend = true;
  lineChartXAxisLabel = 'Fecha y Hora';
  lineChartYAxisLabel = 'Saldo';

  constructor(
    private movimientosService: MovimientosService,
    private transferService: TransferService
  ) { }

  ngOnInit(): void {
    this.cargarHistorial();
    this.cargarMovimientos();
  }

  cargarHistorial() {
    this.transferService.obtenerHistorialUsuario().subscribe({
      next: data => {
        this.historial = data;
        this.actualizarLineChartHistorial();
      },
      error: err => {
        console.error('Error al cargar historial:', err);
      }
    });
  }

  cargarMovimientos(): void {
    this.movimientosService.obtenerMovimientosPorUsuario().subscribe({
      next: data => {
        this.movimientos = data;
        this.categorias = ['Todas', ...Array.from(new Set(data.map(m => m.categoria)))].filter(c => c !== 'Transferencia');
        this.aplicarFiltros();
      },
      error: () => {
        this.movimientos = [];
      }
    });
  }

  aplicarFiltros(): void {
    this.filteredMovimientos = this.movimientos.filter(m => {
      const fecha = new Date(m.fecha);
      const desdeOk = this.fechaInicio ? fecha >= new Date(this.fechaInicio) : true;
      const hastaOk = this.fechaFin ? fecha <= new Date(this.fechaFin) : true;
      const categoriaOk = this.categoriaSeleccionada === 'Todas' || m.categoria === this.categoriaSeleccionada;
      return desdeOk && hastaOk && categoriaOk;
    });

    this.actualizarPieChart();
  }

  actualizarPieChart(): void {
    const movimientosFiltrados = this.filteredMovimientos.filter(m => m.categoria !== 'Transferencia');

    const agrupado = movimientosFiltrados.reduce((acc, m) => {
      acc[m.categoria] = (acc[m.categoria] || 0) + Math.abs(m.abono);
      return acc;
    }, {} as Record<string, number>);

    this.pieChartData = Object.entries(agrupado).map(([name, value]) => ({ name, value }));
  }

  actualizarLineChartHistorial(): void {
    const cuentasMap = new Map<string, { name: string, series: { name: string, value: number }[] }>();

    this.historial.forEach(item => {
      const cuenta = item.numero_cuenta;
      const fecha = new Date(item.fecha);
      const label = fecha.toLocaleString(); // incluye fecha y hora

      if (!cuentasMap.has(cuenta)) {
        cuentasMap.set(cuenta, {
          name: `Cuenta ${cuenta}`,
          series: []
        });
      }

      cuentasMap.get(cuenta)!.series.push({
        name: label,
        value: parseFloat(item.saldo)
      });
    });

    this.lineChartData = Array.from(cuentasMap.values());
  }

}
