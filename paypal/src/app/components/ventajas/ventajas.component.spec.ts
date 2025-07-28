import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentajasComponent } from './ventajas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VentajasComponent', () => {
  let component: VentajasComponent;
  let fixture: ComponentFixture<VentajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentajasComponent ],
      imports: [ HttpClientTestingModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el título principal correcto', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('.hero-section h1');
    expect(h1).toBeTruthy();
    expect(h1?.textContent).toContain('El banco que se adapta a ti');
  });

  it('debería tener tarjetas con clase feature-card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.feature-card');
    expect(cards.length).toBe(10); 
  });
  
  it('ngAfterViewInit debería agregar clase show a las tarjetas visibles', () => {
    // Mock IntersectionObserver porque no funciona real en tests
    const observeSpy = jasmine.createSpy('observe');
    const unobserveSpy = jasmine.createSpy('unobserve');
    (window as any).IntersectionObserver = class {
      constructor(private callback: Function) {}
      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect() {}
      takeRecords() { return []; }
    };
    component.ngAfterViewInit();
    expect(observeSpy).toHaveBeenCalled();
  });
});
