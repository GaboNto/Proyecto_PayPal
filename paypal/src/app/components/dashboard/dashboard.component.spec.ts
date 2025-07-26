import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // Módulo de gráficos
import { of } from 'rxjs'; // Para crear Observables simulados
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para mockear HttpClient

import { DashboardComponent } from './dashboard.component';
import { MovimientosService } from '../../services/movimientos.service'; // Importa el servicio real para tipado
import { TransferService } from '../../services/transfer.service'; // Importa el servicio real para tipado

// Define tipos de datos de ejemplo para las pruebas
const mockMovimientos = [
  { id: 1, fecha: '2025-07-01T10:00:00Z', descripcion: 'Compra A', abono: -5000, categoria: 'Compras', tipo: 'Gasto', numero_cuenta: '123' },
  { id: 2, fecha: '2025-07-05T11:00:00Z', descripcion: 'Salario', abono: 100000, categoria: 'Ingreso', tipo: 'Ingreso', numero_cuenta: '123' },
  { id: 3, fecha: '2025-07-10T12:00:00Z', descripcion: 'Transferencia recibida', abono: 20000, categoria: 'Transferencia', tipo: 'Ingreso', numero_cuenta: '456' },
  { id: 4, fecha: '2025-07-15T13:00:00Z', descripcion: 'Pago factura B', abono: -15000, categoria: 'Servicios', tipo: 'Gasto', numero_cuenta: '123' },
];

const mockHistorial = [
  { id: 1, numero_cuenta: '123', saldo: '100000.00', fecha: '2025-07-01T09:00:00Z' },
  { id: 2, numero_cuenta: '123', saldo: '95000.00', fecha: '2025-07-01T10:00:00Z' },
  { id: 3, numero_cuenta: '456', saldo: '50000.00', fecha: '2025-07-09T10:00:00Z' },
  { id: 4, numero_cuenta: '456', saldo: '70000.00', fecha: '2025-07-10T12:00:00Z' },
];

// Comienza la suite de pruebas para DashboardComponent
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  // Declaramos los espías para los servicios
  let mockMovimientosService: jasmine.SpyObj<MovimientosService>;
  let mockTransferService: jasmine.SpyObj<TransferService>;

  // Configuración que se ejecuta antes de cada prueba
  beforeEach(async () => {
    // Creamos espías para los métodos de los servicios que el componente utiliza
    mockMovimientosService = jasmine.createSpyObj('MovimientosService', ['obtenerMovimientosPorUsuario']);
    mockTransferService = jasmine.createSpyObj('TransferService', ['obtenerHistorialUsuario', 'obtenerTipoYSaldoPorCuenta']);

    // Configuramos el módulo de pruebas de Angular
    await TestBed.configureTestingModule({
      imports: [
        CommonModule, // Necesario para directivas como ngIf, ngFor
        FormsModule,    // Necesario para ngModel
        NgxChartsModule, // Módulo de gráficos
        HttpClientTestingModule // Para mockear las dependencias de HttpClient si los servicios lo usan internamente
      ],
      // Declaramos el componente que estamos probando
      declarations: [DashboardComponent],
      // Proveemos los mocks de los servicios en lugar de los servicios reales
      providers: [
        { provide: MovimientosService, useValue: mockMovimientosService },
        { provide: TransferService, useValue: mockTransferService }
      ]
    })
      .compileComponents(); // Compila el componente y su plantilla
  });

  // Configuración que se ejecuta antes de cada prueba individual
  beforeEach(() => {
    // Definimos los valores de retorno por defecto para los espías
    mockMovimientosService.obtenerMovimientosPorUsuario.and.returnValue(of(mockMovimientos));
    mockTransferService.obtenerHistorialUsuario.and.returnValue(of(mockHistorial));
    // Mockear obtenerTipoYSaldoPorCuenta para cada cuenta
    mockTransferService.obtenerTipoYSaldoPorCuenta.and.callFake((cuentaNumero: string) => {
      if (cuentaNumero === '123') {
        return of({ tipoCuenta: 'Cuenta Vista', saldo: 150000 });
      } else if (cuentaNumero === '456') {
        return of({ tipoCuenta: 'Cuenta Ahorro', saldo: 75000 });
      }
      return of(null); // En caso de una cuenta no mockeada
    });


    // Creamos una instancia del componente
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara la detección de cambios (ejecuta ngOnInit)
  });

  // --- Pruebas Individuales ---

  it('should create', () => {
    // Verifica que el componente se haya creado exitosamente
    expect(component).toBeTruthy();
  });

  it('should load historial and movimientos on ngOnInit', () => {
    // Verifica que los métodos de carga de datos se llamen al inicializar el componente
    expect(mockTransferService.obtenerHistorialUsuario).toHaveBeenCalled();
    expect(mockMovimientosService.obtenerMovimientosPorUsuario).toHaveBeenCalled();
    // Verifica que los datos se asignen correctamente
    expect(component.historial).toEqual(mockHistorial);
    expect(component.movimientos).toEqual(mockMovimientos);
  });

  it('should filter movements and update pie chart', () => {
    // Simula la aplicación de filtros
    component.fechaInicio = '2025-07-01';
    component.fechaFin = '2025-07-10';
    component.categoriaSeleccionada = 'Compras';
    component.aplicarFiltros();

    // Verifica que los movimientos se filtren correctamente
    expect(component.filteredMovimientos.length).toBe(1);
    expect(component.filteredMovimientos[0].descripcion).toBe('Compra A');

    // Verifica que el pie chart se actualice con los datos filtrados (solo compras, excluyendo transferencias)
    expect(component.pieChartData).toEqual([{ name: 'Compras', value: 5000 }]);

    // Prueba con 'Todas' las categorías
    component.categoriaSeleccionada = 'Todas';
    component.aplicarFiltros();
    expect(component.pieChartData).toEqual([
      { name: 'Compras', value: 5000 },
      { name: 'Servicios', value: 15000 }
    ]);
  });

  it('should update lineChartsDataPorCuenta correctly', async () => {
    // Llama al método que actualiza los gráficos de línea
    await component.actualizarLineChartsPorCuenta();

    // Verifica que se haya llamado a obtenerTipoYSaldoPorCuenta para cada cuenta única en el historial
    expect(mockTransferService.obtenerTipoYSaldoPorCuenta).toHaveBeenCalledWith('123');
    expect(mockTransferService.obtenerTipoYSaldoPorCuenta).toHaveBeenCalledWith('456');

    // Verifica la estructura y los datos de lineChartsDataPorCuenta
    expect(component.lineChartsDataPorCuenta.length).toBe(2);

    // Verifica la primera cuenta (123)
    const cuenta123 = component.lineChartsDataPorCuenta.find(c => c.cuenta === '123');
    expect(cuenta123).toBeDefined();
    expect(cuenta123?.tipoCuenta).toBe('Cuenta Vista');
    expect(cuenta123?.saldoActual).toBe(150000);
    expect(cuenta123?.data[0].series.length).toBe(2); // Dos entradas para la cuenta 123
    expect(cuenta123?.data[0].series[0].value).toBe(100000);
    expect(cuenta123?.data[0].series[1].value).toBe(95000);

    // Verifica la segunda cuenta (456)
    const cuenta456 = component.lineChartsDataPorCuenta.find(c => c.cuenta === '456');
    expect(cuenta456).toBeDefined();
    expect(cuenta456?.tipoCuenta).toBe('Cuenta Ahorro');
    expect(cuenta456?.saldoActual).toBe(75000);
    expect(cuenta456?.data[0].series.length).toBe(2); // Dos entradas para la cuenta 456
    expect(cuenta456?.data[0].series[0].value).toBe(50000);
    expect(cuenta456?.data[0].series[1].value).toBe(70000);
  });

  it('should handle empty historial for line charts', async () => {
    // Mockear historial vacío
    mockTransferService.obtenerHistorialUsuario.and.returnValue(of([]));
    component.historial = []; // Asegurarse de que el componente también tenga historial vacío

    await component.actualizarLineChartsPorCuenta();

    expect(component.lineChartsDataPorCuenta.length).toBe(0);
  });

  it('should handle errors when fetching account info for line charts', async () => {
    // Simular un error en obtenerTipoYSaldoPorCuenta
    mockTransferService.obtenerTipoYSaldoPorCuenta.and.returnValue(of(null)); // O throwError para simular un error HTTP

    await component.actualizarLineChartsPorCuenta();

    // Las cuentas deberían seguir existiendo pero con tipo/saldo por defecto
    expect(component.lineChartsDataPorCuenta.length).toBe(2);
    expect(component.lineChartsDataPorCuenta[0].tipoCuenta).toBe('Desconocido');
    expect(component.lineChartsDataPorCuenta[0].saldoActual).toBe(0);
  });
});
