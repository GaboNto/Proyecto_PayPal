import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialGoalsComponent } from './financial-goals.component';

describe('FinancialGoalsComponent', () => {
  let component: FinancialGoalsComponent;
  let fixture: ComponentFixture<FinancialGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialGoalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
