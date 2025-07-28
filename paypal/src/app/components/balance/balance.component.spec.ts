import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BalanceComponent } from './balance.component';
import { FinancialGoalsComponent } from '../financial-goals/financial-goals.component';
import { By } from '@angular/platform-browser';

describe('BalanceComponent', () => {
  let component: BalanceComponent;
  let fixture: ComponentFixture<BalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BalanceComponent, FinancialGoalsComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('debería ocultar y mostrar los objetivos financieros', () => {
    expect(component.showFinancialGoals).toBeFalse();
    component.toggleFinancialGoals();
    expect(component.showFinancialGoals).toBeTrue();
    component.toggleFinancialGoals();
    expect(component.showFinancialGoals).toBeFalse();
  });

  it('debería ocultar y mostrar las transacciones', () => {
    expect(component.showTransactions).toBeFalse();
    component.toggleTransactions();
    expect(component.showTransactions).toBeTrue();
    component.toggleTransactions();
    expect(component.showTransactions).toBeFalse();
  });

  it('debería mostrar el texto "Balance Actual" en el template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Balance Actual');
  });

  it('debería mostrar el botón "Transferir"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.btn.btn-primary');
    expect(button?.textContent).toContain('Transferir');
  });

  it('debería mostrar el componente FinancialGoalsComponent cuando showFinancialGoals es true', () => {
    component.showFinancialGoals = true;
    fixture.detectChanges();
    const goals = fixture.debugElement.query(By.directive(FinancialGoalsComponent));
    expect(goals).toBeTruthy();
  });

});