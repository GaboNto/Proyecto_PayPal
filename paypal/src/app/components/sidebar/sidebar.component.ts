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
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isLoggedIn$: Observable<boolean>;
  mostrarSidebar = true;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      const navEnd = event as NavigationEnd;
      const urlActual = navEnd.urlAfterRedirects;

      const rutasSinSidebar = [
        '/donde-comprar',
        '/ventajas',
        '/tarjetas-publica',
        '/seguridad-publica',
        '/register',
        '/pre-registro',
        '/login',
        '/', '/#features', '/forgot-password'
      ];

      if (rutasSinSidebar.includes(urlActual) || urlActual.startsWith('/otra-ruta')) {
        this.mostrarSidebar = false;
      } else {
        this.mostrarSidebar = true;
      }

    });
  }
}
