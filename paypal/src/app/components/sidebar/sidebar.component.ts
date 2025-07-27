/**
 * Componente de barra lateral (sidebar) que muestra opciones de navegación
 * cuando el usuario ha iniciado sesión. También permite cerrar sesión.
 * 
 * La visibilidad del sidebar se ajusta dinámicamente según la ruta activa.
 * 
 * Ejemplo: se oculta en rutas como `/donde-comprar` o aquellas que comienzan con `/otra-ruta`.
 */
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd, Event } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    /**
   * Observable que indica si el usuario está autenticado.
   */
  isLoggedIn$: Observable<boolean>;
   /**
   * Controla si el sidebar se muestra o se oculta.
   */
  mostrarSidebar = true;

    /**
   * Inyecta los servicios necesarios.
   * @param authService Servicio de autenticación
   * @param router Servicio de navegación Angular
   */
  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Escucha eventos de navegación para mostrar u ocultar el sidebar
   * dependiendo de la URL activa.
   */
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      const navEnd = event as NavigationEnd;
      const urlActual = navEnd.urlAfterRedirects;

      if (urlActual === '/donde-comprar' || urlActual.startsWith('/otra-ruta')) {
        this.mostrarSidebar = false;
      } else {
        this.mostrarSidebar = true;
      }
    });
  }
}
