import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyDisable2faComponent } from './verify-disable-2fa.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

function setupActivatedRoute(token: string | null) {
  return {
    snapshot: {
      queryParamMap: {
        get: jasmine.createSpy('get').and.returnValue(token),
      },
    },
  };
}

describe('VerifyDisable2faComponent', () => {
  let component: VerifyDisable2faComponent;
  let fixture: ComponentFixture<VerifyDisable2faComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyDisable2faComponent, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useValue: setupActivatedRoute('valid-token') },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyDisable2faComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('debería manejar respuesta exitosa del servidor', () => {
    const req = httpMock.expectOne('/api/users/2fa/disable-confirm');
    req.flush({ message: '2FA desactivado correctamente' });
    expect(component.success).toBeTrue();
    expect(component.message).toBe('2FA desactivado correctamente');
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error del servidor', () => {
    const req = httpMock.expectOne('/api/users/2fa/disable-confirm');
    req.flush({ message: 'Token inválido o expirado' }, { status: 400, statusText: 'Bad Request' });
    expect(component.success).toBeFalse();
    expect(component.message).toBe('Token inválido o expirado');
    expect(component.loading).toBeFalse();
  });

  it('debería mostrar loading al iniciar y luego ocultarlo', () => {
    expect(component.loading).toBeTrue(); // justo después de ngOnInit y antes de respuesta

    const req = httpMock.expectOne('/api/users/2fa/disable-confirm');
    req.flush({ message: '2FA desactivado correctamente' });

    expect(component.loading).toBeFalse();
  });

  it('debería redirigir a /configuracion al hacer click en el botón', () => {
    const req = httpMock.expectOne('/api/users/2fa/disable-confirm');
    req.flush({ message: '2FA desactivado correctamente' });

    spyOn(router, 'navigate');

    component.goToConfig();

    expect(router.navigate).toHaveBeenCalledWith(['/configuracion']);
  });
});

