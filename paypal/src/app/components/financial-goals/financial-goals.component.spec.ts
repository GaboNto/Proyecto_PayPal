import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialGoalsComponent } from './financial-goals.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FinancialGoalsComponent', () => {
  let component: FinancialGoalsComponent;
  let fixture: ComponentFixture<FinancialGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FinancialGoalsComponent, HttpClientTestingModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.goalForm).toBeDefined();
    expect(component.goalForm.get('goalName')).toBeTruthy();
    expect(component.goalForm.valid).toBeFalse();
  });

  it('debería mostrar el modal y setear prioridad por defecto al abrir', () => {
    component.openModal();
    expect(component.showModal).toBeTrue();
    expect(component.goalForm.get('priority')?.value).toBe('media');
  });

  it('debería ocultar el modal y resetear el formulario al cerrar', () => {
    component.goalForm.patchValue({ goalName: 'test' });
    component.closeModal();
    expect(component.showModal).toBeFalse();
    expect(component.goalForm.get('goalName')?.value).toBeNull();
  });

  it('debería agregar una nueva meta válida al enviar el formulario', () => {
    component.goalForm.setValue({
      goalName: 'Auto nuevo',
      targetAmount: 5000000,
      months: 24,
      initialAmount: 500000,
      priority: 'alta',
      description: 'Comprar auto eléctrico'
    });

    component.onSubmit();

    expect(component.goals.length).toBeGreaterThan(1); 
    expect(component.goals[0].goalName).toBe('Auto nuevo');
    expect(component.goals[0].progress).toBeCloseTo(10); 
  });

  it('no debería agregar una meta si el formulario es inválido', () => {
    component.goalForm.setValue({
      goalName: '',
      targetAmount: 0,
      months: 0,
      initialAmount: 0,
      priority: '',
      description: ''
    });

    component.onSubmit();

    expect(component.goals.length).toBe(1); 
  });

  it('debería formatear correctamente el monto en CLP', () => {
    const formatted = component.formatAmount(123456);
    expect(formatted).toContain('$');
    expect(formatted).toContain('123.456');
  });



  it('debería mostrar mensaje de "sin metas" si no hay metas', () => {
    component.goals = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const emptyText = compiled.querySelector('.empty-state')?.textContent;
    expect(emptyText).toContain('No hay metas financieras');
  });

  it('debería renderizar metas en la tabla', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('.goals-table tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });
});
