import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { firstValueFrom } from 'rxjs';

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

  // Cambiamos esta variable: ahora será un array de objetos, uno por cuenta
  lineChartsDataPorCuenta: {
    cuenta: string;
    tipoCuenta: string;
    saldoActual: number;
    data: any[];
  }[] = [];


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
        this.actualizarLineChartsPorCuenta();
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

  async actualizarLineChartsPorCuenta(): Promise<void> {
    const cuentasMap = new Map<string, { name: string; series: { name: string; value: number }[] }>();

    this.historial.forEach(item => {
      const cuenta = item.numero_cuenta;
      const fecha = new Date(item.fecha);
      const fechaISO = fecha.toISOString().substring(0, 19);

      if (!cuentasMap.has(cuenta)) {
        cuentasMap.set(cuenta, {
          name: `Cuenta ${cuenta}`,
          series: []
        });
      }

      cuentasMap.get(cuenta)!.series.push({
        name: fechaISO,
        value: parseFloat(item.saldo)
      });
    });

    // Ordenar cada serie por fecha ascendente
    cuentasMap.forEach(cuentaData => {
      cuentaData.series.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Obtener array de cuentas para consulta
    const cuentasArray = Array.from(cuentasMap.entries());

    // Para cada cuenta, llamar al servicio para obtener tipoCuenta y saldo
    const lineChartsDataPromises = cuentasArray.map(async ([cuenta, data]) => {
      try {
        // Cambia aquí
        console.log('Llamando a obtenerTipoYSaldoPorCuenta para:', cuenta);
        const info = await firstValueFrom(this.transferService.obtenerTipoYSaldoPorCuenta(cuenta));
        return {
          cuenta,
          tipoCuenta: info?.tipoCuenta || 'Desconocido',
          saldoActual: info?.saldo ?? 0,
          data: [data] // ngx-charts espera un array de series, aquí uno por gráfico
        };
      } catch (error) {
        console.error(`Error al obtener tipo y saldo para cuenta ${cuenta}:`, error);
        return {
          cuenta,
          tipoCuenta: 'Desconocido',
          saldoActual: 0,
          data: [data]
        };
      }
    });

    this.lineChartsDataPorCuenta = await Promise.all(lineChartsDataPromises);
    console.log(this.lineChartsDataPorCuenta);


  }
}