import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ LoginComponent, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido si los campos están vacíos', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería mostrar error si el formulario es inválido y se envía', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.onSubmit();
    expect(component.error).toBeNull();
    expect(component.isLoading).toBeFalse();
  });

  it('debería llamar a AuthService.login y navegar al perfil si el login es exitoso', () => {

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');

  
    const http = TestBed.inject(HttpClientTestingModule) as any;
    spyOn(component['http'], 'post').and.returnValue(of({ accessToken: 'token123' }));
    const router = TestBed.inject(RouterTestingModule) as any;
    spyOn(component['router'], 'navigate');

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('token123');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/profile']);
    expect(component.error).toBeNull();
    expect(component.isLoading).toBeFalse();
  });

  it('debería mostrar error si las credenciales son incorrectas', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('wrongpassword');

    spyOn(component['http'], 'post').and.returnValue(throwError(() => new Error('Unauthorized')));

    component.onSubmit();

    expect(component.error).toBe('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
    expect(component.isLoading).toBeFalse();
  });
});