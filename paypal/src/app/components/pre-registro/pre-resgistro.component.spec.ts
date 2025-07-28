import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreRegistroComponent } from './pre-registro.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyRegisterComponent {}

describe('PreRegistroComponent', () => {
  let component: PreRegistroComponent;
  let fixture: ComponentFixture<PreRegistroComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'register', component: DummyRegisterComponent }
        ]),
        PreRegistroComponent
      ],
      declarations: [DummyRegisterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PreRegistroComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation(); 
    fixture.detectChanges();
  });

  it('debería tener el año actual en currentYear', () => {
    const year = new Date().getFullYear();
    expect(component.currentYear).toBe(year);
  });

  it('debería redirigir a /register', async () => {
    component.irARegistro();
    await fixture.whenStable(); 
    expect(location.path()).toBe('/register');
  });
});
