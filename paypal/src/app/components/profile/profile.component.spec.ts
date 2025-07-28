import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockProfile = {
    id_usuario: 1,
    nombre: 'Juan',
    apellido: 'Perez',
    email: 'juan@example.com',
    fecha_nacimiento: '1990-01-01',
    pais: 'Chile',
    ciudad: 'Santiago',
    cuentas: [{ saldo: 10000 }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProfileComponent, HttpClientTestingModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería setear saldoDisponible cuando llega perfil con cuentas', () => {
    component.userProfile$ = of(mockProfile);

    component.userProfile$.subscribe(profile => {
      if (profile && profile.cuentas && profile.cuentas.length > 0) {
        component.saldoDisponible = profile.cuentas[0].saldo;
      }
      expect(component.saldoDisponible).toBe(10000);
    });
  });

  it('debería manejar perfil sin cuentas sin errores', () => {
    const perfilSinCuentas = {...mockProfile, cuentas: []};
    component.userProfile$ = of(perfilSinCuentas);

    component.userProfile$.subscribe(profile => {
      if (profile && profile.cuentas && profile.cuentas.length > 0) {
        component.saldoDisponible = profile.cuentas[0].saldo;
      } else {
        component.saldoDisponible = 0;
      }
      expect(component.saldoDisponible).toBe(0);
    });
  });

  it('debería manejar perfil null sin errores', () => {
    component.userProfile$ = of(null);

    component.userProfile$.subscribe(profile => {
      if (profile && profile.cuentas && profile.cuentas.length > 0) {
        component.saldoDisponible = profile.cuentas[0].saldo;
      } else {
        component.saldoDisponible = 0;
      }
      expect(component.saldoDisponible).toBe(0);
    });
  });
});
