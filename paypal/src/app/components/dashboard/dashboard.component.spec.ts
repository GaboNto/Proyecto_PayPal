import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MovimientosService } from '../../services/movimientos.service';
import { TransferService } from '../../services/transfer.service';
import { of, throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let movimientosServiceSpy: jasmine.SpyObj<MovimientosService>;
  let transferServiceSpy: jasmine.SpyObj<TransferService>;

  beforeEach(async () => {
    movimientosServiceSpy = jasmine.createSpyObj('MovimientosService', ['obtenerMovimientosPorUsuario']);
    transferServiceSpy = jasmine.createSpyObj('TransferService', ['obtenerHistorialUsuario', 'obtenerTipoYSaldoPorCuenta']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: MovimientosService, useValue: movimientosServiceSpy },
        { provide: TransferService, useValue: transferServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    // Valores por defecto para los servicios
    movimientosServiceSpy.obtenerMovimientosPorUsuario.and.returnValue(of([]));
    transferServiceSpy.obtenerHistorialUsuario.and.returnValue(of([]));
    transferServiceSpy.obtenerTipoYSaldoPorCuenta.and.returnValue(of({ tipoCuenta: 'Ahorro', saldo: 1000 }));
    fixture.detectChanges();
  });

  it('debería llamar a cargarHistorial y cargarMovimientos en ngOnInit', () => {
    const cargarHistorialSpy = spyOn(component, 'cargarHistorial').and.callThrough();
    const cargarMovimientosSpy = spyOn(component, 'cargarMovimientos').and.callThrough();
    component.ngOnInit();
    expect(cargarHistorialSpy).toHaveBeenCalled();
    expect(cargarMovimientosSpy).toHaveBeenCalled();
  });

  it('debería cargar movimientos y actualizar categorías', () => {
    const movimientos = [
      { fecha: '2024-06-01', categoria: 'Compras', abono: 100, descripcion: 'Compra en tienda' },
      { fecha: '2024-06-02', categoria: 'Servicios', abono: 200, descripcion: 'Pago de luz' }
    ];
    movimientosServiceSpy.obtenerMovimientosPorUsuario.and.returnValue(of(movimientos));
    component.cargarMovimientos();
    expect(component.movimientos.length).toBe(2);
    expect(component.categorias).toContain('Compras');
    expect(component.categorias).toContain('Servicios');
  });

  it('debería filtrar movimientos por categoría', () => {
    component.movimientos = [
      { fecha: '2024-06-01', categoria: 'Compras', abono: 100 },
      { fecha: '2024-06-02', categoria: 'Servicios', abono: 200 }
    ] as any;
    component.categoriaSeleccionada = 'Compras';
    component.aplicarFiltros();
    expect(component.filteredMovimientos.length).toBe(1);
    expect(component.filteredMovimientos[0].categoria).toBe('Compras');
  });

  it('debería manejar error al cargar historial', () => {
    transferServiceSpy.obtenerHistorialUsuario.and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    component.cargarHistorial();
    expect(console.error).toHaveBeenCalled();
  });

  it('debería manejar error al cargar movimientos', () => {
    movimientosServiceSpy.obtenerMovimientosPorUsuario.and.returnValue(throwError(() => new Error('Error')));
    component.cargarMovimientos();
    expect(component.movimientos.length).toBe(0);
  });
}); 