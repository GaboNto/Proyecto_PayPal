import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgForm } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RegisterComponent, HttpClientTestingModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('validateRut debería validar correctamente un RUT válido', () => {
    expect(component.validateRut('12.345.678-5')).toBeTrue();
    expect(component.validateRut('12345678-5')).toBeTrue();
    expect(component.validateRut('1-9')).toBeTrue();
  });

  it('validateRut debería invalidar un RUT incorrecto', () => {
    expect(component.validateRut('12.345.678-9')).toBeFalse();
    expect(component.validateRut('abcd')).toBeFalse();
    expect(component.validateRut('')).toBeFalse();
  });

  it('formatRut debería formatear el RUT correctamente', () => {
    expect(component.formatRut('123456785')).toBe('12345678-5');
    expect(component.formatRut('1k')).toBe('1-k');
    expect(component.formatRut('1234')).toBe('123-4');
  });

  it('onRutChange debería setear rutError si el RUT no es válido', () => {
    component.onRutChange({ target: { value: '123456789' } } as any);
    expect(component.rutError).toBe('El RUT ingresado no es válido.');
  });

  it('onRutChange debería limpiar rutError si el RUT es válido', () => {
    component.onRutChange({ target: { value: '12345678-5' } } as any);
    expect(component.rutError).toBe('');
  });

  it('onSubmit debería mostrar alerta si el formulario es inválido', () => {
    spyOn(window, 'alert');
    const fakeForm = {
      invalid: true,
      form: {},
    } as unknown as NgForm;
    component.onSubmit(fakeForm);
    expect(window.alert).toHaveBeenCalledWith('Por favor, completa todos los campos correctamente y acepta las condiciones.');
  });

});
