/**
 * Componente principal del panel de control (dashboard).
 * 
 * Muestra estadísticas financieras del usuario incluyendo:
 * - Historial de transferencias con gráficos de línea por cuenta.
 * - Movimientos categorizados con filtros de fecha y categoría.
 * - Gráfico de torta para visualización de gastos por categoría.
 * 
 * Utiliza los servicios `MovimientosService` y `TransferService` para obtener datos desde el backend.
 */
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
/** Lista completa de movimientos del usuario. */
  movimientos: MovimientoHistorialDto[] = [];
   /** Movimientos filtrados según fecha y categoría. */
  filteredMovimientos: MovimientoHistorialDto[] = [];
  
  /** Historial de transferencias obtenidas del servicio. */
  historial: any[] = [];
 /** Fecha de inicio del filtro. */
  fechaInicio: string = '';
  /** Fecha de término del filtro. */
  fechaFin: string = '';
  /** Categoría actualmente seleccionada para el filtro. */
  categoriaSeleccionada: string = 'Todas';
  /** Lista de categorías disponibles para filtrar movimientos. */
  categorias: string[] = ['Todas'];
/** Datos procesados para el gráfico de torta. */
  pieChartData: any[] = [];

    /**
   * Datos organizados para múltiples gráficos de línea,
   * cada uno correspondiente a una cuenta diferente.
   */
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
  /**
   * Constructor que inyecta los servicios necesarios.
   * @param movimientosService Servicio para obtener movimientos del usuario.
   * @param transferService Servicio para obtener historial y datos de cuentas.
   */
  constructor(
    private movimientosService: MovimientosService,
    private transferService: TransferService
  ) { }

  ngOnInit(): void {
    this.cargarHistorial();
    this.cargarMovimientos();
  }
  /**
   * Obtiene el historial de transferencias del usuario y lo guarda.
   */
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
  /**
   * Obtiene los movimientos financieros del usuario.
   * También construye las categorías únicas para filtrar.
   */
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
  /**
   * Filtra los movimientos por fecha y categoría seleccionada.
   * Luego actualiza el gráfico de torta.
   */
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
 /**
   * Procesa los movimientos filtrados para construir el gráfico de torta.
   * Agrupa por categoría y suma los abonos.
   */
  actualizarPieChart(): void {
    const movimientosFiltrados = this.filteredMovimientos.filter(m => m.categoria !== 'Transferencia');

    const agrupado = movimientosFiltrados.reduce((acc, m) => {
      acc[m.categoria] = (acc[m.categoria] || 0) + Math.abs(m.abono);
      return acc;
    }, {} as Record<string, number>);

    this.pieChartData = Object.entries(agrupado).map(([name, value]) => ({ name, value }));
  }
  /**
   * Construye los datos necesarios para mostrar gráficos de línea,
   * uno por cada cuenta en el historial del usuario.
   * 
   * Obtiene el tipo de cuenta y saldo actual llamando al backend.
   */
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