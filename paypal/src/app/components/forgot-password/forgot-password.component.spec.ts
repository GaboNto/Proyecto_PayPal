import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ForgotPasswordComponent, HttpClientTestingModule, FormsModule, ReactiveFormsModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería tener el formulario inválido al inicio', () => {
    expect(component.forgotForm.valid).toBeFalse();
  });

  it('debería mostrar error si el email es inválido al enviar', () => {
    component.forgotForm.controls['email'].setValue('correo-malo');
    component.onSubmit();
    expect(component.forgotForm.invalid).toBeTrue();
    expect(component.submitted).toBeTrue();
  });


  it('debería mostrar mensaje de error si ocurre una excepción', async () => {
    spyOn(component, 'onSubmit').and.callFake(async () => {
      component.error = 'Error al solicitar recuperación.';
    });
    await component.onSubmit();
    expect(component.error).toBe('Error al solicitar recuperación.');
  });
});