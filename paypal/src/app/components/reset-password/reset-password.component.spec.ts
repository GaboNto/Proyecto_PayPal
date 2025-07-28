import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
   
    component.token = 'dummy-token';
    fixture.detectChanges();
  });


  it('formulario inválido si las contraseñas no coinciden', () => {
    component.resetForm.controls['newPassword'].setValue('123456');
    component.resetForm.controls['confirmPassword'].setValue('654321');
    expect(component.resetForm.valid).toBeFalse();
    expect(component.resetForm.errors?.['mismatch']).toBeTrue();
  });

  it('formulario inválido si las contraseñas son menores a 6 caracteres', () => {
    component.resetForm.controls['newPassword'].setValue('123');
    component.resetForm.controls['confirmPassword'].setValue('123');
    expect(component.resetForm.valid).toBeFalse();
   
    expect(component.resetForm.controls['newPassword'].valid).toBeFalse();
  });

  it('formulario válido si las contraseñas coinciden y tienen longitud adecuada', () => {
    component.resetForm.controls['newPassword'].setValue('abcdef');
    component.resetForm.controls['confirmPassword'].setValue('abcdef');
    expect(component.resetForm.valid).toBeTrue();
  });

  it('onSubmit no llama al servicio si formulario inválido o token vacío', async () => {
    component.token = '';
    component.resetForm.controls['newPassword'].setValue('abcdef');
    component.resetForm.controls['confirmPassword'].setValue('abcdef');
    await component.onSubmit();
    expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();

    component.token = 'token';
    component.resetForm.controls['newPassword'].setValue('abc');
    component.resetForm.controls['confirmPassword'].setValue('abc');
    await component.onSubmit();
    expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
  });



  it('onSubmit muestra error si falla la llamada', async () => {
    const mockError = { error: { message: 'Error al restablecer contraseña' } };
    authServiceSpy.resetPassword.and.returnValue(throwError(() => mockError));

    component.resetForm.controls['newPassword'].setValue('abcdef');
    component.resetForm.controls['confirmPassword'].setValue('abcdef');

    await component.onSubmit();

    expect(authServiceSpy.resetPassword).toHaveBeenCalled();
    expect(component.error).toBe(mockError.error.message);
    expect(component.message).toBe('');
  });
});
