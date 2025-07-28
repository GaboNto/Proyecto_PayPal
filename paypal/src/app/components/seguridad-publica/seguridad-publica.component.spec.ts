import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadPublicaComponent } from './seguridad-publica.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('SeguridadPublicaComponent', () => {
  let component: SeguridadPublicaComponent;
  let fixture: ComponentFixture<SeguridadPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadPublicaComponent, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguridadPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería renderizar el título principal y subtítulo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Seguridad en PayPal');
    expect(compiled.querySelector('.subtitle')?.textContent).toContain('Tu seguridad es nuestra prioridad');
  });

  it('debería mostrar la lista de características de seguridad', () => {
    const items = fixture.nativeElement.querySelectorAll('.seguridad-list li');
    expect(items.length).toBe(5);
    expect(items[0].textContent).toContain('Pagos cifrados de extremo a extremo');
    expect(items[4].textContent).toContain('Alertas y notificaciones de actividad sospechosa');
  });



  it('debería mostrar los consejos de seguridad', () => {
    const consejos = fixture.nativeElement.querySelectorAll('.consejos-list li');
    expect(consejos.length).toBe(4);
    expect(consejos[0].textContent).toContain('Utiliza contraseñas seguras');
    expect(consejos[3].textContent).toContain('Activa las notificaciones para estar al tanto');
  });

  it('debería tener enlaces útiles con URLs correctas y target _blank', () => {
    const enlaces = fixture.nativeElement.querySelectorAll('.enlaces-utiles ul li a');
    expect(enlaces.length).toBe(3);
    expect(enlaces[0].href).toContain('paypal.com/es/webapps/mpp/paypal-safety-and-security');
    expect(enlaces[1].href).toContain('paypal.com/es/smarthelp/article/FAQ1982');
    expect(enlaces[2].href).toContain('paypal.com/es/smarthelp/article/FAQ2254');
    enlaces.forEach((link: HTMLAnchorElement) => {
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('debería tener un botón con routerLink a /register', () => {
    const btnDebug = fixture.debugElement.query(By.css('.cta a.btn'));
    expect(btnDebug).toBeTruthy();
    expect(btnDebug.attributes['routerLink']).toBe('/register');
    expect(btnDebug.nativeElement.textContent).toContain('Crea tu cuenta y compra seguro');
  });
});
