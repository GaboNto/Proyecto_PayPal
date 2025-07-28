import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SecurityComponent } from './security.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['hasBepass', 'getProfile', 'setBepass']);
    const authSpy = jasmine.createSpyObj('AuthService', ['setup2FA', 'forgotPassword']);

    await TestBed.configureTestingModule({
      imports: [ SecurityComponent, HttpClientTestingModule ],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Mockear respuestas iniciales
    userServiceSpy.hasBepass.and.returnValue(of({ hasBepass: false }));
    userServiceSpy.getProfile.and.returnValue(of({ email: 'test@example.com' }));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('ngOnInit carga estado inicial correctamente', () => {
    expect(component.hasBePass).toBeFalse();
    expect(component.userEmail).toBe('test@example.com');
    expect(component.recoverEmail).toBe('test@example.com');
  });

  it('onSubmit muestra error si claves Be Pass no coinciden', () => {
    component.bepassData.newBepass = '123456';
    component.bepassData.confirmBepass = '654321';
    component.onSubmit();
    expect(component.error).toBe('Las claves Be Pass no coinciden.');
  });

  it('onSubmit muestra error si clave no cumple patrón', () => {
    component.bepassData.newBepass = 'abc123';
    component.bepassData.confirmBepass = 'abc123';
    component.onSubmit();
    expect(component.error).toBe('La clave Be Pass debe contener exactamente 6 números.');
  });

  it('onSubmit llama setBepass y maneja éxito con 2FA QR', fakeAsync(() => {
    component.bepassData = { newBepass: '123456', confirmBepass: '123456', currentPassword: 'pass' };
    userServiceSpy.setBepass.and.returnValue(of({ message: 'Clave creada correctamente' }));
    authServiceSpy.setup2FA.and.returnValue(of({ secret: 'some-secret', qr: 'data:image/png;base64,QRDATA' }));
  
    component.onSubmit();
    tick();
  
    expect(userServiceSpy.setBepass).toHaveBeenCalled();
    expect(component.message).toBe('Clave creada correctamente');
    expect(component.hasBePass).toBeTrue();
    expect(component.show2FAQr).toBeTrue();
    expect(component.qrData).toContain('data:image/png;base64');
  }));
  

  it('onRecoverPasswordSubmit maneja envío exitoso de correo', fakeAsync(() => {
    authServiceSpy.forgotPassword.and.returnValue(of({ message: 'Correo enviado' }));
    component.recoverEmail = 'test@example.com';
    component.onRecoverPasswordSubmit();
    tick();

    expect(authServiceSpy.forgotPassword).toHaveBeenCalledWith('test@example.com');
    expect(component.recoverMessage).toBe('Correo enviado');
    expect(component.recoverError).toBe('');
  }));

  it('onRecoverPasswordSubmit maneja error en envío de correo', fakeAsync(() => {
    authServiceSpy.forgotPassword.and.returnValue(throwError(() => ({ error: { message: 'Error de servidor' } })));
    component.recoverEmail = 'test@example.com';
    component.onRecoverPasswordSubmit();
    tick();

    expect(component.recoverMessage).toBe('');
    expect(component.recoverError).toBe('Error de servidor');
  }));
});
