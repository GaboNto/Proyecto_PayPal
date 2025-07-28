import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayComponent } from './pay.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('PayComponent', () => {
  let component: PayComponent;
  let fixture: ComponentFixture<PayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayComponent, HttpClientTestingModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería sumar solo los gastos fijos de pagos activos ', () => {
    const sumaEsperada = component.pagos
      .filter(p => p.activo)
      .reduce((acc, p) => acc + p.monto, 0);
    expect(component.gastosFijos).toBe(sumaEsperada);
  });

  it('debería abrir y cerrar el formulario', () => {
    expect(component.mostrarFormulario).toBeFalse();
    component.abrirFormulario();
    expect(component.mostrarFormulario).toBeTrue();

    component.cancelarFormulario();
    expect(component.mostrarFormulario).toBeFalse();
  });

  it('no debería agregar pago si datos inválidos', () => {
    component.nuevoPago = { nombre: '', monto: 0, diaPago: '', activo: true };
    component.agregarPago();
    expect(component.mostrarTicket).toBeFalse();
    expect(component.pagoPendiente).toBeNull();
  });

  it('debería preparar pago pendiente y mostrar ticket al agregar pago válido', () => {
    component.nuevoPago = { nombre: 'Pago Test', monto: 1000, diaPago: '05', activo: true };
    component.agregarPago();
    expect(component.mostrarTicket).toBeTrue();
    expect(component.pagoPendiente).toEqual(component.nuevoPago);
  });

  it('debería confirmar pago y agregarlo a la lista', () => {
    component.pagoPendiente = { nombre: 'Nuevo Pago', monto: 2000, diaPago: '10', activo: true };
    const pagoEsperado = { ...component.pagoPendiente };  
    const lengthAntes = component.pagos.length;
    component.confirmarPago();
    expect(component.pagos.length).toBe(lengthAntes + 1);
    expect(component.pagos[component.pagos.length - 1]).toEqual(pagoEsperado); 
    expect(component.mostrarFormulario).toBeFalse();
    expect(component.mostrarTicket).toBeFalse();
    expect(component.pagoPendiente).toBeNull();  
    expect(component.nuevoPago.nombre).toBe('');
  });

  it('debería cancelar el ticket y limpiar pagoPendiente', () => {
    component.pagoPendiente = { nombre: 'Pago', monto: 1000, diaPago: '05', activo: true };
    component.mostrarTicket = true;
    component.cancelarTicket();
    expect(component.mostrarTicket).toBeFalse();
    expect(component.pagoPendiente).toBeNull();
  });

  it('debería eliminar pago por índice', () => {
    const lengthAntes = component.pagos.length;
    component.eliminarPago(0);
    expect(component.pagos.length).toBe(lengthAntes - 1);
  });

  it('debería alternar estado activo de un pago', () => {
    const pago = component.pagos[0];
    const estadoInicial = pago.activo;
    component.alternarActivo(pago);
    expect(pago.activo).toBe(!estadoInicial);
  });

  it('botón "Nuevo pago automático" debería mostrar formulario', () => {
    component.mostrarFormulario = false;
    fixture.detectChanges();
    const boton = fixture.debugElement.query(By.css('.btn-agregar'));
    expect(boton).toBeTruthy();
    boton.triggerEventHandler('click', null);
    expect(component.mostrarFormulario).toBeTrue();
  });
});
