import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  // Creamos un AuthService simulado
  const mockAuthService = {
    isLoggedIn$: of(true),
    logout: jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('debería mostrar el sidebar si el usuario está logueado y mostrar Sidebar es true', () => {
    const sidebar = fixture.nativeElement.querySelector('aside.sidebar');
    expect(sidebar).toBeTruthy();
  });

  it('debería contener el enlace "Perfil"', () => {
    const enlacePerfil = fixture.nativeElement.querySelector('a[routerLink="/profile"]');
    expect(enlacePerfil).toBeTruthy();
    expect(enlacePerfil.textContent).toContain('Perfil');
  });

  it('debería ejecutar logout al hacer clic en "Cerrar sesión"', () => {
    const cerrarSesion = fixture.nativeElement.querySelector('a:last-child');
    cerrarSesion.click();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
