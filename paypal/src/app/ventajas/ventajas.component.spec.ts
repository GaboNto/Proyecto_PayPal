import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentajasComponent } from './ventajas.component';

describe('VentajasComponent', () => {
  let component: VentajasComponent;
  let fixture: ComponentFixture<VentajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentajasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
