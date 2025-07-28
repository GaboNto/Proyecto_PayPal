import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HomeComponent, HttpClientTestingModule, RouterTestingModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('debería tener botón para "Comenzar ahora"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn.btn-primary') as HTMLAnchorElement;
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Comenzar ahora');
    expect(button.getAttribute('routerLink')).toBe('/register');
  });

  it('debería mostrar sección de "Transacciones seguras"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const feature = compiled.querySelector('.feature-card h3')?.textContent;
    expect(feature).toContain('Transacciones seguras');
  });

  it('debería mostrar la sección de seguridad', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const securityTitle = compiled.querySelector('.security-section h2')?.textContent;
    expect(securityTitle).toContain('Tu seguridad es nuestra prioridad');
  });

});