import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyEmailComponent } from './verify-email.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

function setupActivatedRoute(token: string | null) {
  return {
    snapshot: {
      queryParamMap: {
        get: jasmine.createSpy('get').and.returnValue(token),
      },
    },
  };
}

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: setupActivatedRoute('valid-token'),
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería manejar respuesta exitosa del servidor', () => {
    const req = httpMock.expectOne('/api/auth/verify-email?token=valid-token');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, message: 'Correo verificado correctamente' });

    expect(component.success).toBeTrue();
    expect(component.message).toBe('Correo verificado correctamente');
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error del servidor', () => {
    const req = httpMock.expectOne('/api/auth/verify-email?token=valid-token');
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Token inválido o expirado' }, { status: 400, statusText: 'Bad Request' });

    expect(component.success).toBeFalse();
    expect(component.message).toBe('Token inválido o expirado');
    expect(component.loading).toBeFalse();
  });

  it('debería mostrar loading al iniciar y luego ocultarlo después de la respuesta', () => {
    expect(component.loading).toBeTrue();

    const req = httpMock.expectOne('/api/auth/verify-email?token=valid-token');
    req.flush({ success: true, message: 'Correo verificado correctamente' });

    expect(component.loading).toBeFalse();
  });
});




